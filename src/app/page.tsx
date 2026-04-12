import Link from "next/link";
import Image from "next/image";
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
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/balance-logo.jpg"
              alt="balance"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl tracking-wide font-light">balance</span>
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Hero — full-width image background */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/studio-wide.jpg"
            alt="balance reformer studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={80}
            height={80}
            className="rounded-full mx-auto mb-8 shadow-lg"
          />
          <p className="text-brand-sage-light text-sm tracking-[0.3em] uppercase mb-6">
            Premium Pilates Training
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
            Master the art
            <br />
            <span className="italic">of movement</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            A structured training course combining expert in-person sessions
            with comprehensive online guidance. Designed for those who are
            serious about their Pilates practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-4 bg-white text-brand-primary text-sm tracking-wider uppercase rounded-full hover:bg-white/90 transition-colors font-medium"
            >
              Start Your Journey
            </Link>
            <a
              href="#about"
              className="px-10 py-4 border border-white/40 text-white text-sm tracking-wider uppercase rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About the Course — with image grid */}
      <section id="about" className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              The Course
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              A different approach to learning
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/reformer-stretch.jpg"
                  alt="Structured learning on reformers"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                Structured Learning
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Follow a carefully designed curriculum that builds your
                knowledge and skills progressively over weeks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/studio-instructor.jpg"
                  alt="Instructor helping student"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                In-Person & Online
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Blend hands-on studio sessions with online learning materials.
                The perfect combination for deep understanding.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/instructor-chat.jpg"
                  alt="Instructors discussing technique"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
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

      {/* Full-width image break */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src="/images/studio-ball-workout.jpg"
          alt="Group Pilates class with medicine balls"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-brand-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              Your journey with balance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
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
                  <span className="text-4xl font-light text-brand-sage/40 shrink-0 w-16">
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
            <div className="relative h-[500px] rounded-2xl overflow-hidden hidden md:block">
              <Image
                src="/images/studio-welcome.jpg"
                alt="Welcome to balance studio"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA with background image */}
      <section className="relative py-32 md:py-40 text-center">
        <div className="absolute inset-0">
          <Image
            src="/images/reformer-class.jpg"
            alt="Pilates reformer class"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-primary/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-white">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Ready to begin?
          </h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            Join the balance course and take the next step in your Pilates
            journey. Expert guidance, structured learning, real results.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/balance-logo.jpg"
              alt="balance"
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-sm text-brand-muted">
              &copy; {new Date().getFullYear()} balance. All rights reserved.
            </p>
          </div>
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
