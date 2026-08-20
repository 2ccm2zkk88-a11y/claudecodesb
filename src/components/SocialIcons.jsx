// Minimal line-style social glyphs. lucide-react dropped brand icons in
// recent versions, so these small inline SVGs fill that gap without
// pulling in a brand-icon package.
export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5v-3.75a2.25 2.25 0 0 1 4.5 0v3.75M12 12.75v3.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path
        d="M15.5 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2h3.3l-.5 3H12v6.5h-3V15h-2v-3h2v-2.3A4.2 4.2 0 0 1 13.5 5h2v3.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
