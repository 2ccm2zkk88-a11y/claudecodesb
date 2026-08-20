import { AlertCircle, Clock, PenLine, UserX } from "lucide-react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import CircuitBackground from "../components/CircuitBackground";
import FalconMark from "../components/FalconMark";
import AudienceCard from "../components/AudienceCard";
import ServiceCard from "../components/ServiceCard";
import PricingCard from "../components/PricingCard";
import CTASection from "../components/CTASection";
import RequestQueue from "../components/RequestQueue";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { audiences, services, pricingPlans, trustPoints } from "../config/site";

const problems = [
  { icon: UserX, text: "Nobody on staff knows how to update the website." },
  { icon: Clock, text: "Information becomes outdated because no one has time to manage it." },
  { icon: PenLine, text: "Small changes turn into major headaches." },
  { icon: AlertCircle, text: "Website maintenance keeps getting pushed aside." },
];

export default function Home() {
  return (
    <>
      <SEO
        title="Website Development & Webmaster Services"
        description="Professional website development, maintenance, and ongoing webmaster support for organizations that need their website taken care of."
      />

      {/* HERO */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
        <CircuitBackground variant="radial" opacity={0.2} glow />
        <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col items-start gap-7">
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Website.
              <br />
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3d8bff] bg-clip-text text-transparent">
                Managed.
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-cf-gray sm:text-lg">
              Professional website development, maintenance, and ongoing webmaster support for organizations that
              need their website taken care of.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/contact" size="lg">
                Get a Website Quote
              </Button>
              <Button to="/services" variant="secondary" size="lg" icon={false}>
                View Services
              </Button>
            </div>

            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
              {trustPoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cf-border bg-cf-surface text-cf-blue-bright">
                    <Icon name={point.icon} size={17} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{point.title}</span>
                    <span className="block text-xs text-cf-gray">{point.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-cf-purple/25"
                style={{ boxShadow: "0 0 120px -20px rgba(139,92,246,0.35)" }}
              />
              <div aria-hidden="true" className="absolute inset-6 rounded-full border border-cf-blue/20" />
              <div aria-hidden="true" className="absolute inset-12 rounded-full border border-cf-purple/15" />
              <CircuitBackground variant="radial" opacity={0.5} glow className="rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FalconMark size={260} glow />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PROBLEM */}
      <section className="relative border-t border-cf-border py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="The problem"
              title="Your website shouldn't become another job."
              description="Most organizations don't struggle because their website is bad — they struggle because nobody has the time, tools, or technical background to keep it current."
            />
            <p className="mt-6 max-w-lg text-base font-semibold text-white">
              That's where CyberFalcon Digital comes in.
            </p>
          </Reveal>

          <Reveal delay={100} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problems.map(({ icon: ProblemIcon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-xl border border-cf-border bg-cf-surface/50 p-4"
              >
                <ProblemIcon size={18} className="mt-0.5 shrink-0 text-cf-purple" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-cf-gray">{text}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* WHO WE HELP */}
      <section className="relative border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Who we help" title="Organizations we work with" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience, i) => (
              <Reveal key={audience.id} delay={i * 60}>
                <AudienceCard {...audience} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-cf-gray-dim">
            And many other organizations that need a reliable webmaster.
          </p>
        </Container>
      </section>

      {/* WHAT WE DO */}
      <section className="relative border-t border-cf-border py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What we do" title="Full-service website support" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 60}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button to="/services" variant="secondary" icon={false}>
              View All Services
            </Button>
          </div>
        </Container>
      </section>

      {/* WEBSITE MANAGEMENT INTERACTIVE */}
      <section className="relative overflow-hidden border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <CircuitBackground opacity={0.1} />
        <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Website management"
              title="You don't need another employee. You need a webmaster."
              description="Instead of hiring, training, and managing someone in-house, you can hand your website's day-to-day updates to CyberFalcon Digital and get back to running your organization."
            />
            <div className="mt-7">
              <Button to="/website-management" variant="secondary" icon={false}>
                See How It Works
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <RequestQueue />
          </Reveal>
        </Container>
      </section>

      {/* PRICING PREVIEW */}
      <section className="relative border-t border-cf-border py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Pricing" title="Simple Website Management Plans" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80}>
                <PricingCard plan={plan} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-cf-gray-dim">
            Custom website development projects are quoted separately.
          </p>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
