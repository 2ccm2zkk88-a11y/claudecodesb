import { Check } from "lucide-react";
import Button from "./Button";

export default function PricingCard({ plan }) {
  const { name, price, features, isFeatured, featuredLabel } = plan;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ${
        isFeatured
          ? "border-2 border-cf-purple bg-cf-surface-hi shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_20px_60px_-20px_rgba(124,58,237,0.5)] lg:-translate-y-3"
          : "border border-cf-border bg-cf-surface/60 hover:border-cf-purple/50"
      }`}
    >
      {isFeatured && featuredLabel && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#3d8bff] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
          {featuredLabel}
        </span>
      )}

      <h3 className="text-xl font-semibold text-white">{name}</h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-cf-gray-dim">Starting at</span>
      </div>
      <div className="mb-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-sm text-cf-gray">/month</span>
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-cf-gray">
            <Check size={16} className="mt-0.5 shrink-0 text-cf-blue-bright" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button to="/contact" variant={isFeatured ? "primary" : "secondary"} className="w-full" icon={false}>
        View Plan Details
      </Button>
    </div>
  );
}
