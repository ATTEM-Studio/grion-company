# GRION COMPANY — 공식 웹사이트

광고를 파는 회사가 아니라 성장의 순서를 설계하는 회사. Next.js(App Router) + TypeScript + Tailwind CSS v4로 만든 전환 중심 랜딩페이지입니다.

## 시작하기

```bash
npm install
npm run dev
```

<http://localhost:3000> 에서 확인할 수 있습니다.

```bash
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # ESLint
npx tsc --noEmit  # 타입 체크
```

## 구조

```
app/
  layout.tsx           # 폰트, SEO 메타데이터, 전역 레이아웃
  page.tsx              # 섹션 조립 (Phase 1 + Phase 2)
  globals.css            # 디자인 토큰(CSS 변수) — 색상/타이포/모션 전부 여기서 관리
  opengraph-image.tsx    # OG 이미지 자동 생성
  api/diagnosis/route.ts # 성장진단 폼 제출 처리 (Resend로 이메일 발송)

components/
  Header, Hero, HeroVisual, ProblemSection, PerspectiveShift, GrowthFlow,
  BottleneckSelector, GrionProcess, SolutionsSection, DiagnosisExample,
  NotDoingSection, PhilosophySection, QualificationSection, FaqSection,
  FinalCta, DiagnosisForm, Footer, MobileStickyCta, Reveal(스크롤 리빌 유틸)

content/site.ts   # 전체 카피/데이터. 문구 수정은 이 파일만 건드리면 됩니다.
lib/               # cn 유틸, BottleneckSelector→DiagnosisForm 연동 이벤트 등
```

## 디자인 토큰

`app/globals.css`의 `:root` 블록에서 배경(`--bg`), 텍스트(`--ink`), 포인트 컬러(`--accent`) 등을 정의하고 `@theme inline`에서 Tailwind 유틸리티(`bg-bg`, `text-ink`, `bg-accent` 등)로 매핑합니다. 브랜드 컬러를 바꾸려면 이 파일의 hex 값만 수정하면 전체 사이트에 반영됩니다.

## 폰트

Google Fonts(next/font/google)는 네트워크가 제한된 빌드 환경에서 실패할 수 있어, 각 OS의 기본 한글 폰트(Pretendard Variable → Apple SD Gothic Neo → Malgun Gothic 등)를 우선 사용하는 시스템 폰트 스택으로 구성했습니다. 별도의 폰트 파일 다운로드 없이 어디서나 안정적으로 빌드/배포되고, 로딩도 더 빠릅니다. Pretendard를 웹폰트로 직접 넣고 싶다면 `next/font/local`로 `.woff2` 파일을 추가하면 됩니다.

## 성장진단 폼 (`components/DiagnosisForm.tsx` + `app/api/diagnosis/route.ts`)

폼 제출은 `app/api/diagnosis/route.ts`(Route Handler)가 받아서 [Resend](https://resend.com)로 이메일을 발송합니다. 아래 두 환경변수를 **Vercel → Project → Settings → Environment Variables**에 설정해야 실제로 작동합니다(로컬 `.env` 파일이 아니라 Vercel 대시보드에 입력 — `.env.example` 참고).

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ | resend.com 가입 후 발급받는 API 키 (무료 티어로 충분) |
| `DIAGNOSIS_NOTIFY_EMAIL` | ✅ | 신청이 들어올 때 받을 이메일 주소 |
| `RESEND_FROM_EMAIL` | 선택 | 비워두면 Resend의 공용 발신 주소(`onboarding@resend.dev`)를 씀 — 도메인 인증 없이 바로 작동. 나중에 Resend에서 도메인을 인증하면 `GRION <hello@grioncompany.com>` 같은 실제 주소로 바꾸면 됨 |
| `NEXT_PUBLIC_SITE_URL` | 선택 | OG/canonical 태그용 실제 배포 주소. 비워두면 현재 vercel.app 주소를 기본값으로 사용. 커스텀 도메인을 연결하면 그 값으로 설정 |

두 필수 환경변수가 없으면 이 API는 성공한 것처럼 속이지 않고 500 에러를 반환합니다 — 그래야 설정을 깜빡했을 때 조용히 리드가 사라지는 대신 Vercel 함수 로그에 바로 드러납니다. 프론트엔드도 실패 시 "제출 중 문제가 발생했습니다" 에러를 보여주고 입력값은 그대로 남겨서 재시도할 수 있게 했습니다.

봇 스팸을 줄이기 위해 화면에는 보이지 않는 허니팟 필드(`website`)를 폼에 심어뒀습니다. 사람은 채울 수 없고, 이 값이 채워진 요청은 API가 조용히 성공 처리만 하고 실제 이메일은 보내지 않습니다.

개인정보 수집 항목은 최소화되어 있고(민감 정보 미수집), 동의 체크박스가 없으면 제출되지 않도록 클라이언트/서버 양쪽에서 검증합니다.

## 배포 전 체크리스트

1. **Vercel Deployment Protection 해제** — Project → Settings → Deployment Protection에서 "Vercel Authentication"이 Production에도 걸려 있으면, 방문자가 사이트 대신 `vercel.com/login`으로 리다이렉트됩니다. 실제 방문자가 볼 수 있어야 하는 도메인은 이 보호에서 반드시 제외하세요. (이건 Vercel 대시보드에서만 바꿀 수 있어서 코드로는 해결이 안 됩니다.)
2. **위 표의 환경변수 설정** — 특히 `RESEND_API_KEY`, `DIAGNOSIS_NOTIFY_EMAIL`. 설정 후 재배포해야 반영됩니다.
3. **커스텀 도메인 연결 고려** — `xxx.vercel.app` 주소를 그대로 쓰면 "정식 오픈 전"이라는 인상을 줄 수 있습니다. 실제 도메인을 연결했다면 `NEXT_PUBLIC_SITE_URL`도 같이 갱신하세요.
4. **테스트 제출** — 배포 후 실제로 폼을 한 번 끝까지 제출해서 이메일이 도착하는지 확인하세요.

## 구현 범위

- **Phase 1** (핵심 플로우): Hero → Problem → Perspective → Growth Flow → Grion Process → Solutions → Final CTA — 완료
- **Phase 2** (추가 전환 요소): Interactive Bottleneck Selector, Diagnosis Example(진단 예시로 명확히 표시), Qualification, Growth Diagnosis Form — 완료
- **Phase 3** (실제 운영 데이터 필요): 실제 성공사례, 고객 후기, 업종별 사례, 인사이트 아티클, 진단 시스템 백엔드 연동 — 아직 데이터가 없어 의도적으로 비워두었습니다. 실제 사례가 쌓이면 `content/site.ts`에 구조를 추가하고 새 섹션 컴포넌트를 붙이는 방식으로 확장하면 됩니다.

## 접근성 / 성능 메모

- 스크롤 리빌 애니메이션은 외부 애니메이션 라이브러리 없이 `IntersectionObserver` 기반의 경량 컴포넌트(`Reveal.tsx`)로 구현했고, `prefers-reduced-motion`을 존중합니다.
- 모든 인터랙션(병목 선택기, 폼, 모바일 메뉴)은 키보드/스크린리더 접근이 가능하도록 `role`, `aria-*`, `focus-visible` 스타일을 적용했습니다.
- 이미지/스톡 사진을 쓰지 않고 HTML·CSS·SVG 기반 시각 요소만 사용해 첫 화면 로딩 부담을 최소화했습니다.
