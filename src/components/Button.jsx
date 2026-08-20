import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-[#7c3aed] to-[#3d8bff] text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_8px_24px_-8px_rgba(124,58,237,0.6)] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.6),0_10px_32px_-6px_rgba(124,58,237,0.75)] hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-white border border-cf-border hover:border-cf-purple/70 hover:bg-white/5",
  ghost: "bg-transparent text-cf-gray hover:text-white",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[0.95rem]",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  icon = true,
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && <ArrowRight size={16} className="shrink-0" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  const Tag = as || "button";
  return (
    <Tag className={classes} {...props}>
      {content}
    </Tag>
  );
}
