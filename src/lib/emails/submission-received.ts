/**
 * Admin notification — a student has submitted a response on a SUBMIT
 * part. Includes a deep link to /admin/submissions so the admin can
 * jump straight in.
 */
export function submissionReceivedEmail(args: {
  studentName: string;
  studentEmail: string;
  sectionTitle: string;
  partTitle: string;
  hasFile: boolean;
  contentPreview: string | null;
  appUrl: string;
}) {
  const { studentName, studentEmail, sectionTitle, partTitle, hasFile, contentPreview, appUrl } = args;

  const previewBlock = contentPreview
    ? `<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 3px solid #1E4D4A; background: #F8F6F1; font-style: italic; color: #4A4A4A;">${escape(
        contentPreview,
      )}${contentPreview.length >= 280 ? "…" : ""}</blockquote>`
    : "";

  const fileBlock = hasFile
    ? `<p style="margin: 12px 0; font-size: 14px; color: #4A4A4A;">📎 An attachment was included with this submission.</p>`
    : "";

  const subject = `New submission from ${studentName} — ${partTitle}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
    <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
      <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1E4D4A;">balance studios</p>
      <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300; color: #1e1a1a;">New submission to review</h1>
      <p style="margin: 0 0 8px; font-size: 14px; color: #4A4A4A;">
        <strong style="color: #1e1a1a;">${escape(studentName)}</strong> submitted a response.
      </p>
      <p style="margin: 0 0 16px; font-size: 13px; color: #777;">
        Section: ${escape(sectionTitle)}<br/>
        Part: ${escape(partTitle)}
      </p>
      ${previewBlock}
      ${fileBlock}
      <a href="${appUrl}/admin/submissions"
         style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
        Review submission
      </a>
      <p style="margin: 32px 0 0; font-size: 12px; color: #999;">
        You're receiving this because you're an admin on the balance course platform.
      </p>
    </div>
  </body>
</html>`;

  const text = [
    `New submission from ${studentName} (${studentEmail})`,
    ``,
    `Section: ${sectionTitle}`,
    `Part: ${partTitle}`,
    ``,
    contentPreview ? `Response preview:\n${contentPreview}\n` : "",
    hasFile ? `Attachment: included` : "",
    ``,
    `Review at: ${appUrl}/admin/submissions`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
