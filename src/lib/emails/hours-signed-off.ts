/**
 * Student notification — an admin has signed off one of their hour-log
 * entries. Sent from /api/admin/hours/[id].
 */
const CATEGORY_LABEL: Record<string, string> = {
  OBSERVATION: "Observation",
  TEACHING: "Teaching",
  SELF_PRACTICE: "Self-practice",
};

export function hoursSignedOffEmail(args: {
  studentName: string;
  category: string;
  dateISO: string;
  durationMinutes: number;
  feedback: string | null;
  appUrl: string;
}) {
  const { studentName, category, dateISO, durationMinutes, feedback, appUrl } = args;

  const categoryLabel = CATEGORY_LABEL[category] ?? category;
  const friendlyDate = new Date(dateISO).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const friendlyDuration = formatMinutes(durationMinutes);

  const subject = `${categoryLabel} hours signed off — ${friendlyDuration}`;

  const feedbackBlock = feedback
    ? `<div style="margin: 16px 0; padding: 16px; border-left: 3px solid #A3C1AD; background: #F8F6F1; color: #1e1a1a;">
         <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #A3C1AD;">Feedback from your instructor</p>
         <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escape(feedback)}</p>
       </div>`
    : "";

  const html = `<!doctype html>
<html><body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #A3C1AD;">balance studios</p>
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300;">Your hours have been signed off</h1>
    <p style="margin: 0 0 8px; font-size: 14px; color: #4A4A4A;">Hi ${escape(studentName)},</p>
    <p style="margin: 0 0 8px; font-size: 14px; color: #4A4A4A;">
      Your <strong>${escape(categoryLabel)}</strong> log for <strong>${escape(friendlyDate)}</strong> (${escape(friendlyDuration)}) has been signed off.
    </p>
    ${feedbackBlock}
    <a href="${appUrl}/hours"
       style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
      View your hours
    </a>
  </div>
</body></html>`;

  const text = [
    `Hi ${studentName},`,
    ``,
    `Your ${categoryLabel} log for ${friendlyDate} (${friendlyDuration}) has been signed off.`,
    feedback ? `\nFeedback:\n${feedback}\n` : "",
    `View your hours: ${appUrl}/hours`,
  ].filter(Boolean).join("\n");

  return { subject, html, text };
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
