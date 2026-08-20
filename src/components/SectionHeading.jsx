export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignClasses = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClasses} ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cf-blue-bright">
          <span className="h-px w-8 bg-gradient-to-r from-cf-purple to-cf-blue" aria-hidden="true" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">{title}</h2>
      {description && <p className="text-base sm:text-lg text-cf-gray leading-relaxed text-balance">{description}</p>}
    </div>
  );
}
