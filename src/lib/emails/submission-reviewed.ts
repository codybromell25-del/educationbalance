/**
 * Student notification — an admin has reviewed their submission and
 * (optionally) left feedback. Sent from /api/admin/submissions.
 */
export function submissionReviewedEmail(args: {
  studentName: string;
  sectionTitle: string;
  partTitle: string;
  feedback: string | null;
  appUrl: string;
  sectionSlug: string;
}) {
  const { studentName, sectionTitle, partTitle, feedback, appUrl, sectionSlug } = args;

  const subject = `Your submission for "${partTitle}" has been reviewed`;

  const feedbackBlock = feedback
    ? `<div style="margin: 16px 0; padding: 16px; border-left: 3px solid #1E4D4A; background: #F8F6F1; color: #1e1a1a;">
         <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #1E4D4A;">Feedback</p>
         <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escape(feedback)}</p>
       </div>`
    : `<p style="margin: 16px 0; font-size: 14px; color: #4A4A4A;">No additional feedback was left.</p>`;

  const html = `<!doctype html>
<html><body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1E4D4A;">balance studios</p>
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300;">Your submission has been reviewed</h1>
    <p style="margin: 0 0 8px; font-size: 14px; color: #4A4A4A;">Hi ${escape(studentName)},</p>
    <p style="margin: 0 0 16px; font-size: 14px; color: #4A4A4A;">
      Your response on <strong>${escape(partTitle)}</strong> (${escape(sectionTitle)}) has been reviewed by the balance team.
    </p>
    ${feedbackBlock}
    <a href="${appUrl}/course/${sectionSlug}"
       style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
      View in course
    </a>
  </div>
</body></html>`;

  const text = [
    `Hi ${studentName},`,
    ``,
    `Your submission on "${partTitle}" (${sectionTitle}) has been reviewed.`,
    ``,
    feedback ? `Feedback:\n${feedback}` : `No additional feedback was left.`,
    ``,
    `View in course: ${appUrl}/course/${sectionSlug}`,
  ].join("\n");

  return { subject, html, text };
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
