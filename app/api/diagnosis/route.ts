// Receives Growth-Diagnosis form submissions and delivers them to two
// independent places:
//
//   1. Google Sheets — the durable record. Rows accumulate in a spreadsheet
//      you can sort, filter and annotate. Delivered through a Google Apps
//      Script web app so no service-account key ever has to live here.
//   2. Email (Resend) — the immediate ping, so a new lead is noticed the
//      same day rather than whenever someone opens the sheet.
//
// Environment variables (Vercel → Settings → Environment Variables):
//
//   SHEETS_WEBHOOK_URL    — the Apps Script deployment URL (see docs/google-sheets.md)
//   SHEETS_WEBHOOK_TOKEN  — optional shared secret; must match the Apps Script
//   RESEND_API_KEY        — from resend.com
//   DIAGNOSIS_NOTIFY_EMAIL — inbox that should receive new submissions
//   RESEND_FROM_EMAIL     — optional; defaults to Resend's shared sender
//
// Delivery is deliberately fault-tolerant: the two channels are attempted
// independently and the visitor sees success if EITHER one worked. Losing a
// real lead because an email provider had a bad minute would be the worst
// possible failure mode for this form. Only when both fail does the visitor
// get an error (and the details are logged so nothing disappears silently).

const REQUIRED_FIELDS = [
  "name",
  "company",
  "industry",
  "region",
  "contact",
  "concern",
] as const;

/**
 * Field order is the contract with the spreadsheet: the Apps Script writes
 * values in exactly this order, so adding a field means appending here
 * (never inserting in the middle) or existing rows will misalign.
 */
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

const asText = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Appends one row to the Google Sheet via the Apps Script web app. */
async function deliverToSheet(body: Record<string, unknown>): Promise<boolean> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.SHEETS_WEBHOOK_TOKEN ?? "",
        submittedAt: new Date().toISOString(),
        // Sent as an ordered array so the sheet's columns stay stable even
        // if a key is renamed on this side later.
        headers: FIELD_ORDER.map((k) => FIELD_LABELS[k]),
        values: FIELD_ORDER.map((k) => asText(body[k])),
      }),
      // Apps Script answers the POST with a 302 to script.googleusercontent.com;
      // following it is required to see the real result.
      redirect: "follow",
    });

    // Apps Script answers with HTTP 200 even when it rejects the request
    // (ContentService has no way to set a status code), so the status alone
    // is not evidence of success — a wrong token would otherwise look like a
    // delivered row and the lead would vanish. The body is the real signal.
    const text = await res.text().catch(() => "");
    let ok = false;
    try {
      ok = JSON.parse(text)?.ok === true;
    } catch {
      ok = false;
    }

    if (!res.ok || !ok) {
      console.error("[api/diagnosis] Sheets webhook rejected", res.status, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[api/diagnosis] Failed to reach Sheets webhook", err);
    return false;
  }
}

/** Sends the notification email through Resend. */
async function deliverByEmail(body: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.DIAGNOSIS_NOTIFY_EMAIL;
  if (!apiKey || !notifyTo) return false;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "GRION 진단 신청 <onboarding@resend.dev>";

  const rows = FIELD_ORDER.filter((key) => asText(body[key]))
    .map((key) => {
      const label = FIELD_LABELS[key];
      const value = escapeHtml(asText(body[key]));
      return `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#10122b">
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
        subject: `[성장진단 신청] ${asText(body.company)} — ${asText(body.name)}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[api/diagnosis] Resend API error", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[api/diagnosis] Failed to reach Resend", err);
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: a real visitor never sees or fills this field (hidden via CSS
  // in the form). A filled value means a bot — return a fake success so it
  // doesn't learn to adapt, but deliver nothing.
  if (asText(body.website) !== "") {
    return Response.json({ ok: true });
  }

  for (const key of REQUIRED_FIELDS) {
    if (!asText(body[key])) {
      return Response.json({ error: `missing_field:${key}` }, { status: 400 });
    }
  }

  const [sheetOk, emailOk] = await Promise.all([
    deliverToSheet(body),
    deliverByEmail(body),
  ]);

  if (!sheetOk && !emailOk) {
    // Everything the visitor typed, in the log, so a misconfiguration
    // never means a permanently lost lead.
    console.error(
      "[api/diagnosis] No delivery channel succeeded — submission was NOT stored or emailed.",
      JSON.stringify(Object.fromEntries(FIELD_ORDER.map((k) => [k, asText(body[k])])))
    );
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true, sheet: sheetOk, email: emailOk });
}
