import { Send, Wrench, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import RequestQueue from "../components/RequestQueue";
import Reveal from "../components/Reveal";
import GlowCard from "../components/GlowCard";
import FAQItem from "../components/FAQItem";
import CTASection from "../components/CTASection";

const steps = [
  {
    icon: Send,
    title: "Send your request",
    description: "Email, message, or call in what you need — a text change, a new page, a photo swap, anything.",
  },
  {
    icon: Wrench,
    title: "We handle it",
    description: "CyberFalcon Digital makes the update following security-conscious, professional practices.",
  },
  {
    icon: CheckCircle2,
    title: "Your website updates",
    description: "The change goes live and you're kept in the loop, with no technical steps on your end.",
  },
];

const faqs = [
  {
    question: "What counts as a website management request?",
    answer:
      "Content updates, announcements, event listings, staff or team changes, document uploads, image swaps, small layout adjustments, and general troubleshooting all fall under website management.",
  },
  {
    question: "How do I send requests to CyberFalcon Digital?",
    answer:
      "Whatever is easiest for you — email, a shared form, or a quick message. During onboarding we'll agree on the process that works best for your organization.",
  },
  {
    question: "Do I still need someone technical on staff?",
    answer:
      "No. That's the point of website management — you get a webmaster without hiring, training, or managing one in-house.",
  },
  {
    question: "What if I need a larger change than a normal update?",
    answer:
      "Larger requests like new site sections or design changes are scoped and handled as part of your plan or quoted separately if they go beyond routine management.",
  },
];

export default function WebsiteManagement() {
  return (
    <>
      <SEO
        title="Website Management"
        description="Outsource your day-to-day website updates to CyberFalcon Digital. Ongoing webmaster support so your website stays current without hiring in-house."
      />

      <PageHero
        eyebrow="Website Management"
        title="You don't need another employee. You need a webmaster."
        description="Hiring, training, and managing an in-house webmaster is a lot to take on. CyberFalcon Digital handles the ongoing care of your website instead — so it's always current, without adding to your workload."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="Real requests, handled quickly."
              description="These are the kinds of requests organizations send us every week."
            />
          </Reveal>
          <Reveal delay={100}>
            <RequestQueue />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="The process" title="Three simple steps" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <GlowCard className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cf-border bg-cf-bg-soft text-cf-blue-bright">
                      <step.icon size={19} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-cf-gray-dim">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-cf-gray">{step.description}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-cf-border py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="Common questions about website management" className="mb-8" />
          </Reveal>
          <Reveal delay={80} className="rounded-2xl border border-cf-border bg-cf-surface/40 px-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Ready to hand off your website?"
        description="See our management plans or get a custom quote for your organization."
        secondaryLabel="View Pricing"
        secondaryTo="/pricing"
      />
    </>
  );
}
