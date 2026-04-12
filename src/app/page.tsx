import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "balance | Premium Pilates Training Course",
  description:
    "Transform your practice with balance. A structured Pilates training course combining expert in-person sessions with comprehensive online learning.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-wide font-light">
            balance
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-screen pt-16 bg-brand-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-surface via-brand-surface to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-6">
            Premium Pilates Training
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-brand-primary mb-8 leading-[1.1]">
            Master the art
            <br />
            <span className="italic">of movement</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            A structured training course combining expert in-person sessions
            with comprehensive online guidance. Designed for those who are
            serious about their Pilates practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-4 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
            >
              Start Your Journey
            </Link>
            <a
              href="#about"
              className="px-10 py-4 border border-brand-border text-brand-primary text-sm tracking-wider uppercase rounded-full hover:bg-brand-surface-hover transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About the Course */}
      <section id="about" className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-4">
              The Course
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              A different approach to learning
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                Structured Learning
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Follow a carefully designed curriculum that builds your
                knowledge and skills progressively over weeks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                In-Person & Online
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Blend hands-on studio sessions with online learning materials.
                The perfect combination for deep understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                Direct Feedback
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Ask questions directly within each section and receive
                personalised responses from our expert instructors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              Your journey with balance
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Enrol & Get Access",
                desc: "Sign up for the course and receive your personal login. Your learning space is ready.",
              },
              {
                step: "02",
                title: "Follow the Flow",
                desc: "New sections unlock weekly, perfectly synced with your in-person training sessions.",
              },
              {
                step: "03",
                title: "Learn & Practice",
                desc: "Work through each section at your own pace. Mark sections complete as you progress.",
              },
              {
                step: "04",
                title: "Ask Questions",
                desc: "Have a question about any section? Ask directly on the page and get expert feedback.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <span className="text-4xl font-light text-brand-accent/40 shrink-0 w-16">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-medium text-brand-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-brand-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Ready to begin?
          </h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            Join the balance course and take the next step in your Pilates
            journey. Expert guidance, structured learning, real results.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-brand-accent text-brand-primary text-sm tracking-wider uppercase rounded-full hover:bg-brand-accent-light transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-muted">
            &copy; {new Date().getFullYear()} balance. All rights reserved.
          </p>
          <a
            href="https://balancestudios.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            balancestudios.ie
          </a>
        </div>
      </footer>
    </div>
  );
}
