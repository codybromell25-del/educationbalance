import Link from "next/link";
import Image from "next/image";

export default function SignUpCancelPage() {
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

        <h1 className="text-3xl font-light tracking-tight text-brand-primary mb-4">
          Payment Cancelled
        </h1>
        <p className="text-brand-muted mb-8 leading-relaxed">
          No worries — your payment was not processed.
          You can try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-brand-border text-brand-primary text-sm tracking-wider uppercase rounded-full hover:bg-brand-surface-hover transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
