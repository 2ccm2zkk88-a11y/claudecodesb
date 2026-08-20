import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import PortfolioCard from "../components/PortfolioCard";
import Reveal from "../components/Reveal";
import CTASection from "../components/CTASection";
import { portfolioProjects } from "../config/site";

export default function Portfolio() {
  return (
    <>
      <SEO
        title="Portfolio"
        description="Website projects built by CyberFalcon Digital."
      />

      <PageHero eyebrow="Portfolio" title="Built by CyberFalcon Digital" />

      <section className="py-16 sm:py-20">
        <Container>
          {portfolioProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 80}>
                  <PortfolioCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-cf-gray">Projects coming soon.</p>
          )}
        </Container>
      </section>

      <CTASection
        title="Want your website featured here next?"
        description="Let's talk about what you're trying to build."
      />
    </>
  );
}
