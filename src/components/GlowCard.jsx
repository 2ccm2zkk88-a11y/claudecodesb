// Dark glass card with a thin border that lights up on hover/focus.
// Shared visual base for audience, service, pricing, and portfolio cards.
export default function GlowCard({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag
      className={`group relative rounded-2xl border border-cf-border bg-cf-surface/60 backdrop-blur-sm transition-all duration-300 hover:border-cf-purple/60 hover:bg-cf-surface focus-within:border-cf-purple/60 ${className}`}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: "0 0 0 1px rgba(139,92,246,0.25), 0 12px 40px -12px rgba(124,58,237,0.35)",
        }}
      />
      {children}
    </Tag>
  );
}
