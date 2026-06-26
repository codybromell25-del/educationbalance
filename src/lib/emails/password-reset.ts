/**
 * Student notification — a password-reset link has been requested.
 * One-time token, 1-hour expiry.
 */
export function passwordResetEmail(args: {
  recipientName: string;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const { recipientName, resetUrl, expiresInMinutes } = args;

  const subject = "Reset your balance studios password";

  const html = `<!doctype html>
<html>
  <body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
    <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
      <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1E4D4A;">balance studios</p>
      <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300; color: #1e1a1a;">Reset your password</h1>
      <p style="margin: 0 0 16px; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
        Hi ${escape(recipientName)},
      </p>
      <p style="margin: 0 0 24px; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
        We received a request to reset the password on your balance studios account. Click the button below to set a new one.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block; padding: 12px 24px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
        Reset password
      </a>
      <p style="margin: 24px 0 0; font-size: 13px; color: #777; line-height: 1.6;">
        This link expires in ${expiresInMinutes} minutes and can only be used once.
      </p>
      <p style="margin: 16px 0 0; font-size: 13px; color: #777; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>
      <p style="margin: 24px 0 0; font-size: 12px; color: #999; word-break: break-all;">
        Button not working? Paste this into your browser:<br/>
        <span style="color: #4A4A4A;">${resetUrl}</span>
      </p>
    </div>
  </body>
</html>`;

  const text = [
    `Hi ${recipientName},`,
    ``,
    `We received a request to reset the password on your balance studios account.`,
    ``,
    `Reset link (expires in ${expiresInMinutes} minutes, single use):`,
    resetUrl,
    ``,
    `If you didn't request this, ignore this email.`,
  ].join("\n");

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
