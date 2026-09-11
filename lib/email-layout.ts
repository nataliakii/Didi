import {
  BRAND_BG,
  BRAND_BG_DEEP,
  BRAND_GOLD,
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_TEXT,
  BRAND_TEXT_MUTED,
} from "@/constants/brand";
import { BRAND_CONTACT } from "@/constants/contact";

export type EmailLayoutContent = {
  preheader?: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function escapeEmailHtml(value: string): string {
  return escapeHtml(value);
}

/** Shared branded HTML shell for transactional mail. Inline CSS for client compatibility. */
export function renderBrandedEmailHtml(content: EmailLayoutContent): string {
  const preheader = content.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(content.preheader)}</div>`
    : "";

  const footerNote = content.footerNote
    ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:${BRAND_TEXT_MUTED};">${escapeHtml(content.footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(content.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND_BG};color:${BRAND_TEXT};font-family:Georgia,'Times New Roman',serif;">
  ${preheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND_BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #D9CFBE;">
          <tr>
            <td style="background:${BRAND_BG_DEEP};padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_GOLD};font-family:Helvetica,Arial,sans-serif;">${escapeHtml(BRAND_NAME)}</p>
              <p style="margin:10px 0 0;font-size:13px;letter-spacing:0.08em;color:#F7F4ED;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(BRAND_TAGLINE)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;font-weight:400;color:${BRAND_TEXT};">${escapeHtml(content.title)}</h1>
              <div style="font-size:15px;line-height:1.65;color:${BRAND_TEXT};font-family:Helvetica,Arial,sans-serif;">
                ${content.bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #D9CFBE;padding:24px 32px;background:#FAF7F0;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${BRAND_TEXT_MUTED};font-family:Helvetica,Arial,sans-serif;">
                With care,<br />
                <strong style="color:${BRAND_TEXT};">${escapeHtml(BRAND_NAME)}</strong><br />
                ${escapeHtml(BRAND_CONTACT.city)}, ${escapeHtml(BRAND_CONTACT.country)}<br />
                <a href="${escapeHtml(BRAND_CONTACT.website)}" style="color:${BRAND_GOLD};text-decoration:none;">${escapeHtml(BRAND_CONTACT.website.replace(/^https?:\/\//, ""))}</a><br />
                <a href="mailto:${escapeHtml(BRAND_CONTACT.email)}" style="color:${BRAND_TEXT_MUTED};text-decoration:none;">${escapeHtml(BRAND_CONTACT.email)}</a>
                ·
                <a href="${escapeHtml(BRAND_CONTACT.phoneHref)}" style="color:${BRAND_TEXT_MUTED};text-decoration:none;">${escapeHtml(BRAND_CONTACT.phone)}</a>
              </p>
              ${footerNote}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailDetailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #EEE7DB;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND_TEXT_MUTED};width:38%;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #EEE7DB;font-size:14px;color:${BRAND_TEXT};font-family:Helvetica,Arial,sans-serif;">${escapeHtml(value)}</td>
  </tr>`;
}

export function emailDetailsTable(rows: Array<{ label: string; value: string }>): string {
  const body = rows
    .filter((row) => row.value.trim().length > 0)
    .map((row) => emailDetailRow(row.label, row.value))
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-collapse:collapse;">${body}</table>`;
}
