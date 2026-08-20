import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import PricingCard from "../components/PricingCard";
import SectionHeading from "../components/SectionHeading";
import FAQItem from "../components/FAQItem";
import Reveal from "../components/Reveal";
import CTASection from "../components/CTASection";
import { pricingPlans } from "../config/site";

const faqs = [
  {
    question: "What does \"starting at\" pricing mean?",
    answer:
      "Plan pricing reflects a starting monthly rate. Your exact rate depends on the size of your website and the amount of ongoing work involved, and is confirmed before you commit to a plan.",
  },
  {
    question: "Is website development included in these plans?",
    answer:
      "No. These plans cover ongoing management and maintenance of an existing website. New website builds and redesigns are quoted separately based on project scope.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. As your organization's needs change, you can move between plans so your website support matches what you actually need.",
  },
  {
    question: "What if my request doesn't fit neatly into a plan?",
    answer:
      "Reach out and describe what you need. Most requests fit within a plan's scope, and anything larger is scoped and quoted transparently before work begins.",
  },
];

export default function Pricing() {
  return (
    <>
      <SEO
        title="Pricing"
        description="Simple, transparent website management plans starting at $99/month. Custom website development quoted separately."
      />

      <PageHero
        eyebrow="Pricing"
        title="Simple Website Management Plans"
        description="Straightforward monthly plans for ongoing website support. No confusing tiers, no hidden scope."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80}>
                <PricingCard plan={plan} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-cf-gray-dim">
            Custom website development projects are quoted separately based on scope.
          </p>
        </Container>
      </section>

      <section className="border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="Pricing questions" className="mb-8" />
          </Reveal>
          <Reveal delay={80} className="rounded-2xl border border-cf-border bg-cf-surface/40 px-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Not sure which plan fits?"
        description="Tell us about your website and we'll recommend the right level of support."
      />
    </>
  );
}
