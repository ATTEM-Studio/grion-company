// GRION COMPANY — 사이트 전체 카피 / 데이터
// 문구 수정은 이 파일에서만 진행하면 됩니다.

export const nav = {
  logo: "GRION",
  items: [
    { label: "성장 구조", href: "#growth-flow" },
    { label: "일하는 방식", href: "#process" },
    { label: "그리온의 기준", href: "#standard" },
    { label: "자주 묻는 질문", href: "#faq" },
  ],
  cta: "성장진단 시작하기",
  ctaHref: "#diagnosis",
};

export const hero = {
  eyebrow: "GRION / GROWTH OPERATING SYSTEM",
  headline: ["매출이 멈춘 곳을", "눈에 보이게", "만듭니다."],
  /** The word that gets the accent color in the headline. */
  headlineAccentLine: 1,
  sub: [
    "광고를 더하기 전에, 사업의 흐름을 확인합니다.",
    "그리온은 현재와 목표 사이의 병목을 찾아 다음 행동으로 바꿉니다.",
  ],
  primaryCta: "내 사업 성장 진단하기",
  primaryCtaHref: "#diagnosis",
  secondaryCta: "계산 결과 자세히 보기",
  secondaryCtaHref: "#levers",
  trustMicro: "광고가 필요하지 않다고 판단되면 광고를 제안하지 않습니다.",
  tags: ["진단", "전략설계", "마케팅 실행", "성장관리"],
  calcHint: "옆 계산기에 지금 사업의 숫자를 넣어보세요. 아무것도 저장되지 않습니다.",
};

export const problem = {
  eyebrow: "THE PROBLEM",
  headline: ["열심히 하고 있는데", "왜 성장은 생각만큼 움직이지 않을까요?"],
  items: [
    "광고를 늘렸는데 문의가 그대로일 수 있습니다.",
    "방문자는 많은데 선택받지 못할 수 있습니다.",
    "문의는 충분한데 상담이나 계약으로 이어지지 않을 수 있습니다.",
    "고객은 충분하지만 한 명의 고객이 만드는 수익이 낮을 수 있습니다.",
    "신규 고객은 계속 생기지만 다시 선택받지 못할 수 있습니다.",
  ],
  emphasis: ["문제가 다른데", "같은 마케팅을 할 수는 없습니다."],
  closing: {
    lead: "그래서 그리온은",
    from: "“어떤 광고를 할까요?”보다",
    to: "“지금 어디가 막혀 있나요?”부터 묻습니다.",
  },
};

export const growthFlow = {
  eyebrow: "01 / THE SYSTEM",
  headline: ["사업의 모든 문제를", "하나의 흐름으로 봅니다."],
  lead: "노출만 늘리고 끝내지 않습니다. 고객이 발견하고, 선택하고, 다시 찾는 과정 전체를 확인합니다.",
  stages: [
    {
      no: "01",
      title: "노출",
      question: "발견되고 있는가",
      body: "검색·지도·광고·콘텐츠에서 우리가 보이고 있는지 확인합니다.",
      items: ["검색", "지도", "광고", "콘텐츠", "SNS", "플랫폼", "제휴"],
    },
    {
      no: "02",
      title: "유입",
      question: "관심이 생겼는가",
      body: "본 사람이 눌러볼 만한 이유가 있는지 확인합니다.",
      items: ["썸네일", "리뷰", "사진", "메뉴", "가격", "첫 문장", "차별점"],
    },
    {
      no: "03",
      title: "방문",
      question: "선택으로 이어졌는가",
      body: "관심이 실제 방문·예약·문의·구매로 이어지는지 확인합니다.",
      items: ["방문", "예약", "문의", "상담", "구매", "신청", "계약"],
    },
    {
      no: "04",
      title: "객단가",
      question: "한 번의 가치가 충분한가",
      body: "한 명의 고객이 만드는 매출이 충분한지 확인합니다.",
      items: ["객단가", "상품 구성", "패키지", "대표상품", "업셀", "마진"],
    },
    {
      no: "05",
      title: "재방문",
      question: "다시 찾을 이유가 있는가",
      body: "한 번 온 고객이 다음 성과로 이어지는지 확인합니다.",
      items: ["재방문", "재구매", "재계약", "추천", "소개", "고객관리", "CRM"],
    },
  ],
  closing: ["모든 숫자를 동시에 바꾸지 않습니다.", "지금 가장 큰 차이를 만들 수 있는", "한 지점부터 찾습니다."],
};

export const calculator = {
  exampleBadge: "예시 값입니다",
  resetLabel: "예시 값으로 되돌리기",
  needRequired:
    "방문 수 · 객단가 · 목표 월매출만 넣으면 계산됩니다. 노출과 유입은 몰라도 괜찮습니다.",
  optionalHint:
    "노출 · 유입 · 재방문율은 선택입니다. 네이버 스마트플레이스나 인스타그램 인사이트의 월간 통계에서 확인할 수 있고, 모르면 비워두셔도 나머지는 그대로 계산됩니다.",
  bottleneckNote:
    "입력하신 숫자 기준입니다. 업종·채널마다 정상 수치가 달라 여기가 곧 문제라는 뜻은 아니고, 먼저 확인해볼 지점입니다.",
  bottleneckNoteExample:
    "지금은 예시 숫자로 계산한 결과입니다. 위 칸을 내 숫자로 바꾸면 내 사업 기준으로 다시 계산됩니다.",
};

export const budget = {
  eyebrow: "03 / THE BUDGET",
  headline: ["그 목표를", "감당할 수 있는 구조인가."],
  lead: "목표를 세우는 것과 그 목표를 감당하는 것은 다릅니다. 그리온이 실제로 쓰는 기준으로 지금 목표가 현실적인지 먼저 확인합니다.",
  rentLabel: "월세",
  rentHint: "월세를 넣으면 마케팅에 쓸 수 있는 여력이 계산됩니다.",
  emptyState:
    "위 계산기에 방문 수 · 객단가 · 목표 월매출을 넣으면, 그 목표를 감당할 수 있는 구조인지 여기에서 확인됩니다.",
  ceilingLabel: "고정비 상한",
  budgetLabel: "가용 마케팅 비용",
  cacLabel: "적정 고객 획득 비용",
  repeatLabel: "재방문율 기준",
  repeatBandNote: "객단가 구간에 따른 기준",
  neededLabel: "목표까지 더 필요한 방문",
  affordableLabel: "이 예산으로 확보 가능한 신규 고객",
  verdictReachable:
    "지금 예산 안에서 신규 고객만으로도 목표에 닿을 수 있는 구조입니다. 그렇다면 어디에 쓸지가 다음 문제입니다.",
  verdictShort:
    "신규 고객을 더 사는 것만으로는 목표에 닿지 않습니다. 광고비를 늘리기 전에 객단가나 재방문부터 봐야 하는 상황입니다.",
  verdictOverrun:
    "월세만으로 이미 고정비 상한을 넘습니다. 이 상태에서 광고비를 늘리면 매장 운영이 흔들립니다. 목표 매출이나 비용 구조부터 다시 봐야 합니다.",
  repeatAdvice:
    "한 번 온 고객이 다시 오게 만드는 쪽이, 같은 고객을 다시 사 오는 것보다 대개 비용이 적게 듭니다.",
  disclaimer:
    "고정비 상한(목표 매출의 10%), 고객 획득 비용(객단가의 25%), 객단가 구간별 재방문율은 업계 평균이 아니라 그리온이 매장 운영 안정성을 기준으로 사용하는 판단 기준입니다. 실제 진단에서는 업종과 상황에 따라 조정합니다.",
};

export const levers = {
  eyebrow: "02 / THE MATH",
  headline: ["목표를 업무 목록이 아니라", "바꿔야 할 숫자로 바꿉니다."],
  emptyState:
    "위 계산기에 현재 숫자와 목표 매출을 넣으면, 목표에 도달하기 위해 각 지표가 얼마가 되어야 하는지 여기에 계산됩니다.",
  closingTitle: "어느 쪽이 현실적인지는 대표님이 가장 잘 압니다.",
  closingBody:
    "객단가를 올리는 게 빠른 사업이 있고, 노출부터 늘려야 하는 사업이 있습니다. 그 판단을 숫자 위에서 같이 하는 것이 그리온이 하는 일입니다.",
  strainedPrefix: "유입한 ",
  strainedSuffix: "이 방문해야 한다는 뜻입니다. 이 지표 하나로 해결하기는 어려울 수 있습니다.",
  impossibleTitle: "단독으로는 불가능",
  impossibleBody:
    "100%를 넘어야 해서, 이 지표 하나로는 목표에 닿을 수 없습니다. 다른 지표와 함께 움직여야 합니다.",
};

export const bottleneckSelector = {
  eyebrow: "05 / WHAT TO CHANGE",
  headline: ["같은 성장 문제도", "해결 방법은 전혀 다릅니다."],
  options: [
    {
      key: "acquisition",
      label: "고객 부족",
      lead: "사람 자체가 부족하다면",
      items: ["광고", "검색", "콘텐츠", "SNS", "플랫폼", "제휴"],
      note: "등을 통해 발견을 늘려야 할 수 있습니다.",
    },
    {
      key: "selection",
      label: "선택 부족",
      lead: "사람은 보고 있지만 우리를 선택하지 않는다면",
      items: ["브랜드", "메시지", "상품", "가격", "리뷰", "사례", "전문성", "차별점"],
      note: "을 먼저 봐야 할 수 있습니다.",
    },
    {
      key: "action",
      label: "행동 부족",
      lead: "관심은 있지만 행동하지 않는다면",
      items: ["랜딩페이지", "상담 과정", "예약 과정", "응대 속도", "신뢰 요소", "CTA"],
      note: "를 먼저 개선해야 할 수 있습니다.",
    },
    {
      key: "retention",
      label: "반복 부족",
      lead: "한 번 거래한 고객이 다시 돌아오지 않는다면",
      items: ["CRM", "고객 DB", "재구매", "재방문", "재계약", "추천", "소개 구조"],
      note: "를 확인해야 할 수 있습니다.",
    },
  ],
  closing: "그래서 먼저 진단합니다.",
};

export const process = {
  eyebrow: "04 / HOW WE WORK",
  headline: "그리온은 이렇게 일합니다.",
  steps: [
    { label: "CURRENT", caption: "현재를 봅니다." },
    { label: "GOAL", caption: "목표를 정합니다." },
    { label: "GAP", caption: "차이를 계산합니다." },
    { label: "BOTTLENECK", caption: "병목을 찾습니다." },
    { label: "PRIORITY", caption: "무엇부터 할지 정합니다." },
    { label: "ACTION", caption: "필요한 방법만 실행합니다." },
    { label: "MEASURE", caption: "숫자로 확인합니다." },
    { label: "NEXT", caption: "다음 성장 지점으로 이동합니다." },
  ],
  closing: "진단 → 설계 → 실행 → 측정 → 다음 성장",
};

export const solutions = {
  eyebrow: "06 / WHAT WE DO",
  headline: ["우리는 채널이 아니라", "문제를 기준으로 일합니다."],
  groups: [
    {
      condition: "더 많은 고객이 필요하다면",
      title: "고객 획득 구조 개선",
      items: ["검색", "콘텐츠", "광고", "SNS", "플랫폼", "지역 마케팅", "제휴", "인플루언서"],
    },
    {
      condition: "발견되지만 선택받지 못한다면",
      title: "선택 구조 개선",
      items: ["브랜드 메시지", "콘텐츠", "후기", "사례", "상품", "페이지", "신뢰 요소"],
    },
    {
      condition: "관심은 있지만 행동하지 않는다면",
      title: "행동 구조 개선",
      items: ["예약", "상담", "문의", "랜딩페이지", "응대 과정", "구매 흐름", "CTA"],
    },
    {
      condition: "고객은 있는데 성과가 부족하다면",
      title: "고객가치 개선",
      items: ["가격", "상품구성", "패키지", "대표상품", "업셀", "고마진 상품"],
    },
    {
      condition: "신규고객 의존도가 높다면",
      title: "반복 성장 구조 구축",
      items: ["CRM", "고객DB", "재방문", "재구매", "재계약", "추천", "소개"],
    },
    {
      condition: "무엇부터 해야 할지 모르겠다면",
      title: "목표 성장 진단",
      items: ["현재 분석", "목표 설정", "병목 선정", "우선순위", "실행 로드맵"],
    },
  ],
  closing: [
    "네이버, Meta, Google, 콘텐츠, 영상, CRM.",
    "무엇을 쓸지는 문제를 확인한 다음에 정합니다.",
  ],
};

export const notDoing = {
  eyebrow: "07 / OUR STANDARD",
  headline: ["모든 걸 해드린다고", "말하지 않습니다."],
  items: [
    {
      claim: "필요하지 않은 광고를 권하지 않습니다.",
      reason: "광고가 병목이 아니라면 다른 문제부터 봅니다.",
    },
    {
      claim: "노출과 조회수만으로 성공이라고 말하지 않습니다.",
      reason: "실제 사업 결과와 가까운 숫자를 봅니다.",
    },
    {
      claim: "모든 채널을 운영하지 않습니다.",
      reason: "현재 필요한 채널만 선택합니다.",
    },
    {
      claim: "매출을 보장한다고 말하지 않습니다.",
      reason: "대신 무엇을 바꾸고 어떤 숫자로 판단할지 명확히 합니다.",
    },
    {
      claim: "대표에게 모든 실행을 떠넘기지 않습니다.",
      reason: "대표 · 직원 · 그리온의 역할을 나눕니다.",
    },
  ],
  closing: ["일을 더 벌이는 건 쉽습니다.", "무엇을 안 해도 되는지 정리하는 게", "그리온이 더 신경 쓰는 부분입니다."],
};

export const philosophy = {
  eyebrow: "GRION COMPANY",
  headline: "사업의 다음 성장을 설계합니다.",
  body: [
    "사업이 성장하지 않는 이유가 항상 노력 부족 때문은 아닙니다.",
    "방향이 잘못됐을 수도 있고, 순서가 잘못됐을 수도 있으며,\n하나의 작은 병목이 전체 성장을 막고 있을 수도 있습니다.",
    "그리온은 현재 위치를 확인하고, 목표와의 차이를 계산하고,\n가장 먼저 바꿔야 할 지점을 찾습니다.",
  ],
  closing: ["광고를 많이 하는 회사가 아니라", "성장의 순서를 설계하는 회사."],
  brand: "GRION COMPANY",
};

export const qualification = {
  headline: ["그리온은 이런 대표와", "잘 맞습니다."],
  fitFrame: "서로 잘 맞는 파트너인지 확인하는 기준입니다.",
  good: [
    "사업은 이미 운영되고 있지만 다음 성장 방법이 보이지 않는다.",
    "마케팅을 하고 있지만 어떤 활동이 실제 성과를 만드는지 모르겠다.",
    "여러 채널을 운영하지만 우선순위가 없다.",
    "목표는 있지만 구체적인 성장 경로가 없다.",
    "단순 업무대행보다 함께 숫자를 보고 판단할 파트너가 필요하다.",
    "데이터를 기반으로 사업을 개선할 의지가 있다.",
  ],
  notGoodLead: "이런 경우에는 잘 맞지 않을 수 있습니다.",
  notGood: [
    "특정 키워드 상위노출만 원한다.",
    "아무런 근거 없이 매출 보장을 요구한다.",
    "사업의 기본적인 데이터를 공유할 수 없다.",
    "내부의 어떤 협조도 어려운 상황이다.",
    "최저가 단순 외주 실행만을 원한다.",
  ],
};

export const faq = {
  headline: ["결정하기 전에", "궁금하실 만한 것들입니다."],
  items: [
    {
      q: "진단만 받고 실행은 직접 해도 되나요?",
      a: "네. 진단 결과와 우선순위는 그대로 가져가시면 됩니다. 실행을 맡기실지는 그다음에 정하셔도 됩니다.",
    },
    {
      q: "비용은 어떻게 되나요?",
      a: "사업 상황과 필요한 실행 범위에 따라 달라져, 진단 상담에서 먼저 안내드립니다. 안내받은 내용을 확인하시기 전까지는 아무것도 진행되지 않습니다.",
    },
    {
      q: "진단 신청 후 얼마나 걸리나요?",
      a: "신청 후 영업일 기준 1~2일 내에 담당자가 연락드리고, 이후 상담을 통해 병목과 우선순위를 함께 확인합니다.",
    },
    {
      q: "우리 업종도 가능한가요?",
      a: "요식업, 카페, 병·의원, 법률·세무·노무 등 전문서비스, 뷰티, 헬스장, 학원, 지역 기반 서비스업처럼 고객의 선택이 매출로 이어지는 사업이라면, 업종에 관계없이 함께 진단할 수 있습니다.",
    },
  ],
};

export const finalCta = {
  headline: ["더 해야 할 일을 찾기 전에", "무엇부터 바꿔야 하는지 확인하세요."],
  body: [
    "고객은 충분한지.",
    "선택받고 있는지.",
    "실제 행동으로 이어지는지.",
    "한 명의 고객이 충분한 가치를 만드는지.",
    "다시 선택받고 있는지.",
  ],
  bodyClosing: "현재 사업의 성장 구조를 그리온과 함께 확인해보세요.",
  primaryCta: "내 사업 성장 진단하기",
  duration: "약 3~5분",
  microCopy: "진단 결과에 따라 광고보다 다른 개선이 먼저 필요하다고 안내드릴 수 있습니다.",
};

export const diagnosisForm = {
  title: "성장진단 시작하기",
  subtitle: "지금 사업이 어디에서 막혀 있는지, 그리온이 함께 확인합니다.",
  step1Title: "기본 정보",
  step2Title: "사업 현황 (선택)",
  fields: {
    name: { label: "대표자 또는 담당자명", placeholder: "홍길동", required: true },
    company: { label: "업체명", placeholder: "그리온컴퍼니", required: true },
    industry: { label: "업종", placeholder: "예: 요식업, 병·의원, 카페, 뷰티 등", required: true },
    region: { label: "지역", placeholder: "예: 서울 강남구", required: true },
    contact: { label: "연락처", placeholder: "010-0000-0000", required: true },
    concern: {
      label: "현재 가장 큰 고민",
      placeholder: "예: 문의는 오는데 계약으로 이어지지 않습니다.",
      required: true,
    },
    revenueCurrent: { label: "현재 월평균 매출", placeholder: "예: 3,000만원", required: false },
    revenueGoal: { label: "목표 월매출", placeholder: "예: 5,000만원", required: false },
    channels: { label: "현재 주요 마케팅 채널", placeholder: "예: 네이버 플레이스, 인스타그램", required: false },
    adBudget: { label: "월 광고비", placeholder: "예: 200만원", required: false },
    acquisition: { label: "주요 고객 획득 경로", placeholder: "예: 지도 검색, 지인 소개", required: false },
    volume: { label: "문의 또는 방문량", placeholder: "예: 월 50건", required: false },
    repeat: { label: "재방문 · 재구매 관련 상황", placeholder: "예: 재방문율을 파악하지 못하고 있음", required: false },
  },
  privacyLabel: "개인정보 수집 및 이용에 동의합니다.",
  privacyDetail:
    "입력하신 정보는 성장 진단 상담 목적으로만 사용되며, 진단 완료 후 별도 요청 시 파기됩니다. 민감한 고객·환자·의뢰인 정보는 입력하지 않아도 됩니다.",
  submit: "진단 신청하기",
  step2Skip: "선택 항목 건너뛰고 제출하기",
  next: "다음",
  back: "이전",
  successTitle: "신청이 접수되었습니다.",
  successBody: "영업일 기준 1~2일 이내에 담당자가 남겨주신 연락처로 안내드립니다.",
};

export const footer = {
  brand: "GRION COMPANY",
  brandKo: "그리온컴퍼니",
  tagline: "광고를 파는 회사가 아니라 성장의 순서를 설계하는 회사.",
  navTitle: "메뉴",
  contactTitle: "문의",
  email: "hello@grioncompany.com",
  copyright: `© ${new Date().getFullYear()} GRION COMPANY. All rights reserved.`,
  legal: ["개인정보처리방침", "이용약관"],
};

export const siteMeta = {
  name: "GRION COMPANY",
  nameKo: "그리온컴퍼니",
};
