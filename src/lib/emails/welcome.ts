/**
 * Welcome email — sent when an admin creates a user account so the new
 * student knows their login email and temporary password.
 *
 * NOTE: includes the temporary password in plaintext. This is the
 * intentional pattern for instructor-created accounts (the student
 * needs to be told what to log in with). Strongly suggest in the body
 * that they change it via the password-reset flow.
 */
export function welcomeEmail(args: {
  recipientName: string;
  recipientEmail: string;
  temporaryPassword: string;
  appUrl: string;
}) {
  const { recipientName, recipientEmail, temporaryPassword, appUrl } = args;

  const subject = "Welcome to balance studios — your account is ready";

  const html = `<!doctype html>
<html><body style="margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F6F1; color:#1e1a1a;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #A3C1AD;">balance studios</p>
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 300;">Welcome to your Pilates training</h1>
    <p style="margin: 0 0 16px; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
      Hi ${escape(recipientName)},
    </p>
    <p style="margin: 0 0 16px; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
      Your balance studios account is ready. Use these credentials to sign in:
    </p>
    <div style="margin: 16px 0; padding: 16px 20px; background: #F8F6F1; border-radius: 12px; border: 1px solid #E5E1D8;">
      <p style="margin: 0; font-size: 12px; color: #777;">Email</p>
      <p style="margin: 0 0 12px; font-size: 14px; color: #1e1a1a; font-family: 'SF Mono', Monaco, monospace;">${escape(recipientEmail)}</p>
      <p style="margin: 0; font-size: 12px; color: #777;">Temporary password</p>
      <p style="margin: 0; font-size: 14px; color: #1e1a1a; font-family: 'SF Mono', Monaco, monospace;">${escape(temporaryPassword)}</p>
    </div>
    <a href="${appUrl}/login"
       style="display:inline-block; margin-top: 8px; padding: 12px 24px; background: #1e1a1a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
      Sign in
    </a>
    <p style="margin: 24px 0 0; font-size: 13px; color: #777; line-height: 1.6;">
      Please change your password as soon as you sign in. You can do that from the
      <a href="${appUrl}/forgot-password" style="color: #A3C1AD;">forgot-password page</a> using this email address.
    </p>
  </div>
</body></html>`;

  const text = [
    `Hi ${recipientName},`,
    ``,
    `Your balance studios account is ready.`,
    ``,
    `Email: ${recipientEmail}`,
    `Temporary password: ${temporaryPassword}`,
    ``,
    `Sign in: ${appUrl}/login`,
    ``,
    `Please change your password as soon as you sign in (${appUrl}/forgot-password).`,
  ].join("\n");

  return { subject, html, text };
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
