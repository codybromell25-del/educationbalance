import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { welcomeEmail } from "@/lib/emails/welcome";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userName, userEmail, userPassword } = session.metadata || {};

    if (!userName || !userEmail || !userPassword) {
      console.error("Missing user metadata in checkout session");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Check if user already exists (idempotency)
    const existing = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existing) {
      const passwordHash = await bcryptjs.hash(userPassword, 12);

      await prisma.user.create({
        data: {
          name: userName,
          email: userEmail,
          passwordHash,
          role: "USER",
        },
      });

      console.log(`User created: ${userEmail}`);

      // Welcome email — fire and forget so a Resend hiccup never
      // returns an error code to Stripe (which would retry the webhook).
      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const { subject, html, text } = welcomeEmail({
        recipientName: userName,
        recipientEmail: userEmail,
        temporaryPassword: userPassword,
        appUrl,
      });
      sendEmailAsync({ to: userEmail, subject, html, text });
    }
  }

  return NextResponse.json({ received: true });
}
