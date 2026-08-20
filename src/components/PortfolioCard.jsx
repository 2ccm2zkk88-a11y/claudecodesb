import { ExternalLink } from "lucide-react";
import GlowCard from "./GlowCard";
import CircuitBackground from "./CircuitBackground";

export default function PortfolioCard({ project }) {
  const { title, description, services, url, image } = project;

  return (
    <GlowCard className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden border-b border-cf-border bg-cf-bg-soft">
        {image ? (
          <img
            src={image}
            alt={`Screenshot of the ${title} website`}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <CircuitBackground variant="radial" opacity={0.35} glow />
            <span className="relative text-sm font-medium text-cf-gray-dim">Project preview coming soon</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cf-gray">{description}</p>
        </div>

        {services?.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Services performed">
            {services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-cf-border bg-cf-bg-soft px-3 py-1 text-xs font-medium text-cf-blue-bright"
              >
                {service}
              </li>
            ))}
          </ul>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 self-start text-sm font-semibold text-white transition-colors hover:text-cf-blue-bright"
        >
          View Project
          <ExternalLink size={15} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </GlowCard>
  );
}
