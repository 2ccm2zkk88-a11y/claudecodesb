import Icon from "./Icon";
import GlowCard from "./GlowCard";

export default function ServiceCard({ icon, title, shortDescription, description, detailed = false }) {
  return (
    <GlowCard className="p-6 flex flex-col gap-3.5 h-full">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cf-border bg-cf-bg-soft text-cf-purple">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-cf-gray">{detailed ? description : shortDescription}</p>
    </GlowCard>
  );
}
