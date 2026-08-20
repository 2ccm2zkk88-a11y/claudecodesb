import Button from "./Button";
import CircuitBackground from "./CircuitBackground";
import Container from "./Container";

export default function CTASection({
  title = "Need someone to take care of your website?",
  description = "Let's make your website one less thing to worry about.",
  ctaLabel = "Request a Quote",
  ctaTo = "/contact",
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="relative overflow-hidden border-y border-cf-border bg-cf-bg-soft py-16 sm:py-20">
      <CircuitBackground variant="radial" opacity={0.22} glow />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-cf-purple/10 via-transparent to-cf-blue/5"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-balance max-w-2xl">{title}</h2>
        <p className="max-w-xl text-cf-gray text-balance">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={ctaTo} size="lg">
            {ctaLabel}
          </Button>
          {secondaryLabel && secondaryTo && (
            <Button to={secondaryTo} variant="secondary" size="lg" icon={false}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
