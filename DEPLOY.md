# 배포 가이드

GitHub에 올린 뒤 Vercel과 연결하는 순서로 설명합니다.
한 번 연결해두면 그다음부터는 **GitHub에 푸시할 때마다 Vercel이 자동으로 배포**합니다.

이 폴더에는 이미 git 저장소와 커밋이 준비되어 있습니다. 바로 푸시하시면 됩니다.

---

## 1단계. GitHub에 올리기

### 새 저장소를 만드는 경우 (권장)

지금 운영 중인 사이트는 다른 코드로 되어 있습니다. 새 저장소 + 새 Vercel
프로젝트로 시작하면 **기존 사이트를 건드리지 않고** 새 버전을 띄워서 비교해볼 수
있고, 마음에 들 때 도메인만 옮기면 됩니다. 가장 안전한 방법입니다.

1. GitHub에서 새 저장소를 만듭니다.
   **README·.gitignore·라이선스는 추가하지 마세요** (빈 저장소여야 충돌이 없습니다).
2. 터미널에서 압축을 푼 폴더로 이동해 아래를 실행합니다.

```bash
cd grion-company
git remote add origin https://github.com/<계정>/<저장소이름>.git
git push -u origin main
```

> `git push` 할 때 비밀번호를 물어보면, GitHub 계정 비밀번호가 아니라
> **Personal Access Token**이 필요합니다.
> GitHub → Settings → Developer settings → Personal access tokens →
> Tokens (classic) → Generate new token → `repo` 권한 체크 후 생성한 값을
> 비밀번호 자리에 붙여넣으면 됩니다.
> (`gh` CLI를 쓰신다면 `gh auth login` 후 `gh repo create` 한 줄로도 됩니다.)

### 기존 저장소에 반영하는 경우

기존 코드를 이 버전으로 교체하려면, `main`에 바로 덮어쓰지 말고 브랜치로 올려서
Vercel 미리보기로 확인한 뒤 합치세요.

```bash
cd grion-company
git remote add origin <기존 저장소 주소>
git fetch origin
git checkout -b redesign/growth-calculator
git push -u origin redesign/growth-calculator
```

푸시하면 Vercel이 이 브랜치용 미리보기 URL을 자동으로 만들어줍니다.
확인 후 GitHub에서 Pull Request를 열어 `main`에 머지하면 운영에 반영됩니다.

---

## 2단계. Vercel에 연결하기

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. 방금 만든 GitHub 저장소를 **Import**
3. 설정은 건드릴 필요 없습니다. Next.js를 자동으로 인식합니다.
   - Framework Preset: `Next.js`
   - Build Command / Output Directory: 기본값 그대로
4. **Deploy** 클릭

---

## 3단계. 환경변수 설정 (안 하면 진단 폼이 작동하지 않습니다)

Vercel → 해당 프로젝트 → **Settings → Environment Variables**

| 변수 | 필수 | 값 |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ | [resend.com](https://resend.com) 가입 후 발급 (무료 티어로 충분) |
| `DIAGNOSIS_NOTIFY_EMAIL` | ✅ | 진단 신청을 받을 이메일 주소 |
| `RESEND_FROM_EMAIL` | 선택 | 비워두면 Resend 공용 발신주소 사용. 도메인 인증 후 실제 주소로 교체 |
| `NEXT_PUBLIC_SITE_URL` | 선택 | 최종 사이트 주소 (예: `https://grioncompany.com`) |

입력 후 **재배포해야 반영됩니다** — Deployments → 최신 배포 → ⋯ → Redeploy.

설정하지 않으면 폼 제출 시 사용자에게 에러가 보이고 Vercel 함수 로그에
`RESEND_API_KEY ... is not set`이 남습니다. 조용히 리드가 사라지지는 않습니다.

---

## 4단계. 배포 후 점검

- [ ] **Deployment Protection 끄기** — Settings → Deployment Protection.
      켜져 있으면 방문자가 사이트 대신 Vercel 로그인 화면을 봅니다.
- [ ] **폼 테스트 제출** — 실제로 한 번 끝까지 제출해서 메일이 도착하는지 확인.
- [ ] **도메인 연결** — Settings → Domains.
      `xxx.vercel.app` 주소는 "아직 오픈 전" 인상을 줍니다.
      연결 후 `NEXT_PUBLIC_SITE_URL`도 같이 맞추세요.
- [ ] **모바일에서 한 번 열어보기** — 방문자 상당수가 휴대폰으로 들어옵니다.

---

## 참고: 로컬에서 확인하기

```bash
npm install
npm run dev       # http://localhost:3000
npm run verify    # 타입체크 + 린트 + 빌드 (CI와 동일)
```

`.github/workflows/ci.yml` 덕분에 GitHub에 푸시하면 위 검증이 자동으로 돌아갑니다.
PR 화면에서 초록 체크가 뜨면 Vercel 배포도 안전하다고 보시면 됩니다.
