/**
 * Transactional email — server-side only.
 *
 * Wraps the Resend SDK with a defensive sendEmail() that:
 *   - throws a clear error if RESEND_API_KEY isn't set
 *   - never throws into the caller's hot path: errors are logged but
 *     callers can choose to await + catch or fire-and-forget
 *
 * Templates live in src/lib/emails/*.ts as pure functions that return
 * { subject, html, text }.
 */
import { Resend } from "resend";

const FROM_DEFAULT =
  process.env.EMAIL_FROM ?? "balance studios <team@balancestudios.ie>";

let _resend: Resend | null = null;

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY not set. Sign up at resend.com and add the key to .env.",
    );
  }
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

export type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  /** ReplyTo header, e.g. so admin notification replies go to the student. */
  replyTo?: string;
};

/** Sends one email. Throws on transport failure. */
export async function sendEmail(args: SendArgs): Promise<void> {
  const { data, error } = await getClient().emails.send({
    from: args.from ?? FROM_DEFAULT,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
  if (!data?.id) {
    throw new Error("Resend returned no id — send may have failed silently.");
  }
}

/**
 * Fire-and-forget variant for use inside API routes where we don't want
 * email failures to fail the request. Logs errors instead of throwing.
 */
export function sendEmailAsync(args: SendArgs): void {
  void sendEmail(args).catch((e) => {
    console.error("[email] send failed:", e instanceof Error ? e.message : e);
  });
}
