import Icon from "./Icon";
import GlowCard from "./GlowCard";

export default function AudienceCard({ icon, title, description }) {
  return (
    <GlowCard className="p-6 flex flex-col gap-4 h-full">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cf-border bg-cf-bg-soft text-cf-blue-bright">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-cf-gray">{description}</p>
    </GlowCard>
  );
}
