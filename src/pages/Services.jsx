import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import ServiceCard from "../components/ServiceCard";
import Reveal from "../components/Reveal";
import CTASection from "../components/CTASection";
import { services } from "../config/site";

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Website development, redesign, management, content updates, maintenance, and technical support from CyberFalcon Digital."
      />

      <PageHero
        eyebrow="Services"
        title="Everything your website needs, handled by one team."
        description="From building a new site to keeping an existing one current and running smoothly, CyberFalcon Digital covers the full lifecycle of a professional website."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 60}>
                <ServiceCard {...service} detailed />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Not sure which service you need?"
        description="Tell us what's going on with your website and we'll point you in the right direction."
        ctaLabel="Request a Quote"
      />
    </>
  );
}
