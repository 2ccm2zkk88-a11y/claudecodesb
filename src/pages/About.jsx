import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import GlowCard from "../components/GlowCard";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import CTASection from "../components/CTASection";
import FalconMark from "../components/FalconMark";
import { business, trustPoints } from "../config/site";

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="CyberFalcon Digital is the website development and webmaster services arm of the CyberFalcon technology brand, founded by Sable R Banks."
      />

      <PageHero
        eyebrow="About"
        title="Technology expertise without the technical headache."
        description="CyberFalcon Digital exists so organizations can have a professional, well-maintained website without needing to become web experts themselves."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <Reveal className="flex flex-col gap-6 text-base leading-relaxed text-cf-gray">
            <h2 className="text-2xl font-bold text-white">Meet the founder</h2>
            <p>
              CyberFalcon Digital is founded and run by <span className="font-semibold text-white">Sable R Banks</span>,
              who serves as Founder &amp; Webmaster. CyberFalcon Digital brings together website administration,
              hands-on technical work, and security-conscious practices to help organizations maintain a website
              they can rely on.
            </p>
            <p>
              CyberFalcon Digital is part of the broader CyberFalcon brand — built on the same technology-first,
              security-conscious approach — focused specifically on the website and webmaster side of that work:
              building, managing, and maintaining websites for organizations that need someone dependable handling
              it.
            </p>
            <p>
              The goal is simple: give organizations a website partner who communicates clearly, works with sound
              technical practices, and treats ongoing website care as a real, recurring responsibility — not an
              afterthought.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <GlowCard className="flex flex-col items-center gap-5 p-8 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cf-border bg-cf-bg-soft">
                <FalconMark size={56} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Sable R Banks</p>
                <p className="text-sm text-cf-blue-bright">Founder & Webmaster</p>
              </div>
              <p className="text-xs text-cf-gray-dim">{business.name}</p>
            </GlowCard>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="How we work" title="What you can expect" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {trustPoints.map((point, i) => (
              <Reveal key={point.title} delay={i * 80}>
                <GlowCard className="flex h-full flex-col gap-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cf-border bg-cf-bg-soft text-cf-purple">
                    <Icon name={point.icon} size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-cf-gray">{point.description}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Have a project in mind?"
        description="Let's talk about what your website needs."
      />
    </>
  );
}
