/**
 * Admin notification — a new course application has come in via the
 * landing-page form. Includes the pathway, the applicant's notes, and
 * a Reply-To header set to the applicant so admins can respond
 * directly from their inbox.
 */
export function applicationReceivedEmail(args: {
  applicantName: string;
  applicantEmail: string;
  pathway: string;
  notes: string | null;
  appUrl: string;
}) {
  const { applicantName, applicantEmail, pathway, notes, appUrl } = args;

  const subject = `New course application — ${applicantName}`;

  const notesBlock = notes
    ? `<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 3px solid #A3C1AD; background: #F8F6F1; color: #4A4A4A; white-space: pre-wrap;">${escape(notes)}</blockquote>`
    : "";

  const html = `<!doctype html>
<html><body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #A3C1AD;">balance studios</p>
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300;">New course application</h1>
    <p style="margin: 0 0 8px; font-size: 14px; color: #4A4A4A;"><strong style="color:#1e1a1a;">${escape(applicantName)}</strong></p>
    <p style="margin: 0 0 16px; font-size: 13px; color: #777;">
      ${escape(applicantEmail)}<br/>
      Pathway: <strong>${escape(pathway)}</strong>
    </p>
    ${notesBlock}
    <a href="${appUrl}/admin/applications"
       style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
      View application
    </a>
  </div>
</body></html>`;

  const text = [
    `New course application from ${applicantName} <${applicantEmail}>`,
    `Pathway: ${pathway}`,
    notes ? `\nNotes:\n${notes}` : "",
    ``,
    `View at: ${appUrl}/admin/applications`,
  ].join("\n");

  return { subject, html, text };
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
