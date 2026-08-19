// Receives Growth-Diagnosis form submissions and emails them via Resend
// (https://resend.com). Requires two environment variables set in Vercel
// (Project → Settings → Environment Variables):
//
//   RESEND_API_KEY        — from resend.com (free tier is enough to start)
//   DIAGNOSIS_NOTIFY_EMAIL — the inbox that should receive new submissions
//
// Optional:
//   RESEND_FROM_EMAIL — defaults to Resend's shared "onboarding@resend.dev"
//                        sender, which works immediately with no domain
//                        verification. Once a sending domain is verified in
//                        Resend, point this at a real @grioncompany.com (or
//                        whatever the final domain is) address instead.
//
// Without RESEND_API_KEY / DIAGNOSIS_NOTIFY_EMAIL set, this endpoint returns
// a 500 with a clear error rather than silently pretending to succeed —
// so a missing configuration is loud in the Vercel function logs instead of
// quietly losing real leads.

const REQUIRED_FIELDS = [
  "name",
  "company",
  "industry",
  "region",
  "contact",
  "concern",
] as const;

const FIELD_LABELS: Record<string, string> = {
  name: "대표자 또는 담당자명",
  company: "업체명",
  industry: "업종",
  region: "지역",
  contact: "연락처",
  concern: "현재 가장 큰 고민",
  revenueCurrent: "현재 월평균 매출",
  revenueGoal: "목표 월매출",
  channels: "현재 주요 마케팅 채널",
  adBudget: "월 광고비",
  acquisition: "주요 고객 획득 경로",
  volume: "문의 또는 방문량",
  repeat: "재방문 · 재구매 관련 상황",
  // Carried over from the hero growth calculator when the visitor used it.
  aovEntered: "객단가 (계산기 입력)",
  bottleneck: "계산기가 표시한 확인 지점",
};

const FIELD_ORDER = Object.keys(FIELD_LABELS);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: a real visitor never sees or fills this field (hidden via
  // CSS in the form). A filled value means a bot submitted the form —
  // return a fake success so the bot doesn't learn to adapt, but skip
  // sending an email.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  for (const key of REQUIRED_FIELDS) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim()) {
      return Response.json({ error: `missing_field:${key}` }, { status: 400 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.DIAGNOSIS_NOTIFY_EMAIL;

  if (!apiKey || !notifyTo) {
    console.error(
      "[api/diagnosis] RESEND_API_KEY or DIAGNOSIS_NOTIFY_EMAIL is not set — submission was NOT emailed.",
      { name: body.name, company: body.company }
    );
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || "GRION 진단 신청 <onboarding@resend.dev>";

  const rows = FIELD_ORDER.filter((key) => typeof body[key] === "string" && (body[key] as string).trim())
    .map((key) => {
      const label = FIELD_LABELS[key];
      const value = escapeHtml(String(body[key]));
      return `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1c19">
      <h2 style="margin:0 0 16px">새 성장진단 신청이 도착했습니다</h2>
      <table style="border-collapse:collapse">${rows}</table>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [notifyTo],
        subject: `[성장진단 신청] ${body.company} — ${body.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[api/diagnosis] Resend API error", res.status, text);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[api/diagnosis] Failed to reach Resend", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
