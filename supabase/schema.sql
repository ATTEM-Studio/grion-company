-- GRION COMPANY 랜딩(우리 업장 정밀진단) Supabase 구조 정의
-- 2026-11-26 기준 운영 프로젝트(mukzpevdviwsueclbxso)에서 뽑아 정리한 파일입니다.
-- 새 프로젝트에 복원할 때: SQL Editor에 통째로 실행 → 맨 아래 "처음 설정" 두 줄을 채워 실행.
-- 비밀값(ADMIN_DB_SECRET)과 신청자 데이터는 이 파일에 들어 있지 않습니다.

-- ───────── 테이블 (모두 RLS 켜짐, 정책 없음 = 직접 읽기·쓰기 불가, 아래 함수로만 접근) ─────────
create table if not exists public.landing_applications (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  contact text not null,
  concern text,
  placeurl text,
  competitors text,
  source text,
  extra jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    constraint landing_applications_status_check
    check (status in ('new','contacted','consulting','started','closed')),
  memo text
);
create index if not exists landing_applications_created_idx
  on public.landing_applications (created_at desc);

create table if not exists public.landing_admin_secret (
  id integer not null default 1 primary key check (id = 1),
  hash bytea not null
);

create table if not exists public.landing_login_throttle (
  id integer not null default 1 primary key check (id = 1),
  fails integer not null default 0,
  locked_until timestamptz
);

alter table public.landing_applications  enable row level security;
alter table public.landing_admin_secret  enable row level security;
alter table public.landing_login_throttle enable row level security;

-- ───────── 함수 (SECURITY DEFINER) ─────────
create or replace function public.landing_admin_check(p_secret text)
returns boolean language sql stable security definer set search_path to '' as $$
  select exists (
    select 1 from public.landing_admin_secret
    where id = 1 and hash = sha256(convert_to(coalesce(p_secret,''), 'utf8'))
  );
$$;

create or replace function public.landing_login_locked()
returns boolean language sql stable security definer set search_path to '' as $$
  select coalesce((select locked_until > now() from public.landing_login_throttle where id = 1), false);
$$;

create or replace function public.landing_login_record(p_ok boolean)
returns void language plpgsql security definer set search_path to '' as $$
begin
  if p_ok then
    update public.landing_login_throttle set fails = 0, locked_until = null where id = 1;
  else
    update public.landing_login_throttle
      set fails = case when fails + 1 >= 5 then 0 else fails + 1 end,
          locked_until = case when fails + 1 >= 5 then now() + interval '15 minutes' else locked_until end
      where id = 1;
  end if;
end $$;

create or replace function public.submit_application(p jsonb)
returns uuid language plpgsql security definer set search_path to '' as $$
declare new_id uuid;
begin
  if coalesce(length(p->>'name'),0) not between 1 and 100
     or coalesce(length(p->>'company'),0) not between 1 and 200
     or coalesce(length(p->>'contact'),0) not between 1 and 40 then
    raise exception 'invalid_input';
  end if;
  insert into public.landing_applications (name, company, contact, concern, placeurl, competitors, source, extra)
  values (
    p->>'name', p->>'company', p->>'contact',
    left(nullif(p->>'concern',''), 2000), left(nullif(p->>'placeurl',''), 1000),
    left(nullif(p->>'competitors',''), 1000), left(nullif(p->>'source',''), 200),
    case when jsonb_typeof(p->'extra') = 'object' then p->'extra' else '{}'::jsonb end
  ) returning id into new_id;
  return new_id;
end $$;

create or replace function public.admin_list_applications(p_secret text)
returns setof public.landing_applications language plpgsql security definer set search_path to '' as $$
begin
  if not public.landing_admin_check(p_secret) then raise exception 'unauthorized'; end if;
  return query select * from public.landing_applications order by created_at desc limit 2000;
end $$;

create or replace function public.admin_update_application(p_secret text, p_id uuid, p_status text, p_memo text)
returns void language plpgsql security definer set search_path to '' as $$
begin
  if not public.landing_admin_check(p_secret) then raise exception 'unauthorized'; end if;
  update public.landing_applications set status = p_status, memo = left(nullif(p_memo,''), 2000) where id = p_id;
end $$;

-- ───────── 실행 권한 (anon·authenticated가 함수만 실행 가능) ─────────
grant execute on function public.submit_application(jsonb)                          to anon, authenticated;
grant execute on function public.admin_list_applications(text)                      to anon, authenticated;
grant execute on function public.admin_update_application(text, uuid, text, text)   to anon, authenticated;
grant execute on function public.landing_login_locked()                             to anon, authenticated;
grant execute on function public.landing_login_record(boolean)                      to anon, authenticated;
-- landing_admin_check 는 다른 함수 안에서만 쓰며, 외부에서 직접 부르게 하지 않습니다.
revoke execute on function public.landing_admin_check(text) from public, anon, authenticated;

-- ───────── 처음 설정 (새 프로젝트에서만 1회) ─────────
-- 1) Vercel의 ADMIN_DB_SECRET 값과 같은 문자열로 넣습니다. (이 파일에는 값을 적지 않습니다)
--    insert into public.landing_admin_secret (id, hash) values (1, sha256(convert_to('여기에_ADMIN_DB_SECRET', 'utf8')));
-- 2) 로그인 잠금 카운터 한 줄
--    insert into public.landing_login_throttle (id) values (1) on conflict do nothing;
