import CircuitBackground from "./CircuitBackground";
import Container from "./Container";

// Compact hero used on interior pages (non-Home), keeping visual language
// consistent without repeating the full homepage hero.
export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden border-b border-cf-border py-16 sm:py-20">
      <CircuitBackground variant="radial" opacity={0.16} />
      <Container className="relative max-w-3xl">
        {eyebrow && (
          <div className="mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cf-blue-bright">
            <span className="h-px w-8 bg-gradient-to-r from-cf-purple to-cf-blue" aria-hidden="true" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cf-gray sm:text-lg text-balance">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
