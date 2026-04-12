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
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm text-brand-primary hover:text-brand-sage transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
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
            with comprehensive online guidance. Designed for aspiring Pilates
            instructors who are serious about their craft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-10 py-4 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium"
            >
              Sign Up Now
            </Link>
            <a
              href="#curriculum"
              className="px-10 py-4 border border-white/40 text-white text-sm tracking-wider uppercase rounded-full hover:bg-white/10 transition-colors"
            >
              View Curriculum
            </a>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
                Is This You?
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-brand-primary mb-8">
                Built for aspiring
                <br />
                <span className="italic">Pilates instructors</span>
              </h2>
              <div className="space-y-5">
                {[
                  "You want to become a qualified Pilates instructor",
                  "You're passionate about movement and helping others",
                  "You want to understand the reformer inside and out",
                  "You learn best with a mix of hands-on and theory",
                  "You value expert mentorship and personal feedback",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-sage/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-brand-sage"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-brand-primary">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden hidden md:block">
              <Image
                src="/images/instructor-helping.jpg"
                alt="Instructor guiding a student"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Course */}
      <section id="about" className="py-24 md:py-32 bg-brand-surface">
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

      {/* What You'll Learn — Curriculum */}
      <section id="curriculum" className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              Curriculum
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary mb-6">
              What you&apos;ll learn
            </h2>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">
              8 comprehensive sections delivered over 8 weeks, each building
              on the last. Theory meets practice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                num: "01",
                title: "Foundations of Pilates",
                desc: "Core principles, history, and philosophy of the method",
              },
              {
                num: "02",
                title: "Anatomy & Alignment",
                desc: "Key anatomical concepts and proper body alignment",
              },
              {
                num: "03",
                title: "Core Activation & Breathing",
                desc: "The powerhouse, deep core engagement, lateral breathing",
              },
              {
                num: "04",
                title: "Mat Work Essentials",
                desc: "Fundamental mat exercises, modifications, and progressions",
              },
              {
                num: "05",
                title: "Reformer Fundamentals",
                desc: "Setup, safety, and foundational reformer exercises",
              },
              {
                num: "06",
                title: "Programming & Sequencing",
                desc: "Designing sessions that flow logically and safely",
              },
              {
                num: "07",
                title: "Cueing & Communication",
                desc: "Verbal, visual, and tactile cueing techniques",
              },
              {
                num: "08",
                title: "Special Populations",
                desc: "Adapting for pre/postnatal, injuries, and more",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex gap-4 p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-sage/40 transition-colors"
              >
                <span className="text-2xl font-light text-brand-sage/50 shrink-0 w-10">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-medium text-brand-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-muted">{item.desc}</p>
                </div>
              </div>
            ))}
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
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Meet Your Instructor */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              Your Instructor
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              Learn from the best
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="relative h-[450px] rounded-2xl overflow-hidden">
              <Image
                src="/images/studio-welcome.jpg"
                alt="Lead instructor"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-light text-brand-primary mb-2">
                [Instructor Name]
              </h3>
              <p className="text-brand-sage text-sm tracking-wider uppercase mb-6">
                Lead Instructor & Founder
              </p>
              <p className="text-brand-muted leading-relaxed mb-6">
                With years of experience in reformer Pilates and a passion
                for developing the next generation of instructors, our lead
                trainer brings a unique blend of expertise, warmth, and
                attention to detail to every session.
              </p>
              <p className="text-brand-muted leading-relaxed mb-8">
                Having trained hundreds of clients and built balance studios
                across Kildare and Wicklow, they understand what it takes to
                go from student to confident, capable instructor.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-light text-brand-primary">5</p>
                  <p className="text-xs text-brand-muted tracking-wider uppercase">
                    Studios
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-light text-brand-primary">1000+</p>
                  <p className="text-xs text-brand-muted tracking-wider uppercase">
                    Clients Trained
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-light text-brand-primary">8+</p>
                  <p className="text-xs text-brand-muted tracking-wider uppercase">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-brand-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              What our students say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This course completely changed how I understand Pilates. The combination of in-person and online made it so much easier to retain everything.",
                name: "Sarah M.",
                role: "Graduate, Cohort 1",
              },
              {
                quote:
                  "The feedback system is incredible. Being able to ask questions within each section and get personal responses made all the difference.",
                name: "Emma K.",
                role: "Graduate, Cohort 1",
              },
              {
                quote:
                  "I went from complete beginner to teaching my first class in 8 weeks. The structured approach gave me the confidence I needed.",
                name: "Rachel D.",
                role: "Graduate, Cohort 2",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-brand-border p-8"
              >
                <svg
                  className="w-8 h-8 text-brand-sage/30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-brand-primary leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-medium text-brand-primary">{t.name}</p>
                  <p className="text-sm text-brand-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-background">
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
                src="/images/reformer-class.jpg"
                alt="Pilates reformer class"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-brand-surface">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              Investment
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              Start your career in Pilates
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border p-10 md:p-12 shadow-sm">
            <div className="text-center mb-8">
              <p className="text-sm text-brand-muted tracking-wider uppercase mb-3">
                Full Course Access
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-light text-brand-primary">
                  €499
                </span>
              </div>
              <p className="text-brand-muted mt-2">One-time payment</p>
            </div>

            <div className="border-t border-brand-border pt-8 mb-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "8 comprehensive course sections",
                  "In-person training sessions",
                  "Online learning platform access",
                  "Personal progress tracking",
                  "Direct Q&A with instructors",
                  "Lifetime access to materials",
                  "Certificate on completion",
                  "balance community membership",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-brand-sage shrink-0"
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
                    <span className="text-sm text-brand-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/signup"
              className="block w-full py-4 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium text-center"
            >
              Enrol Now
            </Link>

            <p className="text-xs text-brand-muted text-center mt-4">
              Secure payment via Stripe. Instant access after enrolment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
              Common questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Do I need any prior Pilates experience?",
                a: "No prior teaching experience is required, though a basic understanding of Pilates as a participant is helpful. This course is designed to take you from enthusiast to instructor.",
              },
              {
                q: "How is the course structured?",
                a: "The course runs over 8 weeks with one section unlocking each week. Each section combines online theory with in-person practical sessions at our studio.",
              },
              {
                q: "Where do the in-person sessions take place?",
                a: "In-person sessions take place at our balance studios in Kildare and Wicklow. You'll be notified of the exact location and times when you enrol.",
              },
              {
                q: "How long do I have access to the online content?",
                a: "You get lifetime access to all course materials. You can revisit any section at any time, even after completing the course.",
              },
              {
                q: "Can I ask questions during the course?",
                a: "Absolutely. Every section has a built-in Q&A feature where you can ask questions and receive personalised responses directly from our instructors.",
              },
              {
                q: "Will I receive a certificate?",
                a: "Yes, upon successful completion of all 8 sections, you'll receive a balance Pilates instructor certificate.",
              },
              {
                q: "What is the refund policy?",
                a: "We offer a full refund within 7 days of enrolment if you haven't accessed more than 2 sections. Please contact us for details.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-white rounded-2xl border border-brand-border p-6"
              >
                <h3 className="font-medium text-brand-primary mb-2">
                  {item.q}
                </h3>
                <p className="text-brand-muted leading-relaxed text-sm">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 md:py-40 text-center">
        <div className="absolute inset-0">
          <Image
            src="/images/studio-mirror.jpg"
            alt="balance studio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-primary/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-white">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Your Pilates career starts here
          </h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            Join the next cohort of balance-trained instructors.
            Expert guidance, structured learning, real results.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium"
          >
            Sign Up Now
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
