import Link from "next/link";
import Image from "next/image";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-6">
      <div className="w-full max-w-md text-center">
        <Image
          src="/images/balance-logo.jpg"
          alt="balance"
          width={64}
          height={64}
          className="rounded-full mx-auto mb-6 shadow-lg"
        />

        <div className="w-16 h-16 rounded-full bg-brand-sage/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-brand-sage"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-light tracking-tight text-brand-primary mb-4">
          Welcome to balance
        </h1>
        <p className="text-brand-muted mb-8 leading-relaxed">
          Your payment was successful and your account has been created.
          You can now sign in and start your Pilates training journey.
        </p>

        <Link
          href="/login"
          className="inline-block px-10 py-4 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
        >
          Sign In to Your Course
        </Link>

        <p className="text-xs text-brand-muted mt-6">
          A confirmation email will be sent to your inbox.
        </p>
      </div>
    </div>
  );
}
