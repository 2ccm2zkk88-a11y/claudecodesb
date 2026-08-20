import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Container from "./Container";
import { LinkedinIcon, FacebookIcon, InstagramIcon } from "./SocialIcons";
import { business, contact, social, nav } from "../config/site";

const socialLinks = [
  { key: "email", href: social.email, label: "Email", Icon: Mail, show: Boolean(contact.email) },
  { key: "linkedin", href: social.linkedin, label: "LinkedIn", Icon: LinkedinIcon, show: Boolean(social.linkedin) },
  { key: "facebook", href: social.facebook, label: "Facebook", Icon: FacebookIcon, show: Boolean(social.facebook) },
  {
    key: "instagram",
    href: social.instagram,
    label: "Instagram",
    Icon: InstagramIcon,
    show: Boolean(social.instagram),
  },
].filter((item) => item.show);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cf-border bg-cf-bg-soft">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cf-purple/50 to-transparent"
      />
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-cf-gray">{business.footerDescription}</p>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
          <ul className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-sm text-cf-gray transition-colors hover:text-cf-blue-bright">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Let's Connect</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-cf-gray">
            {contact.email && (
              <li>
                <a href={social.email} className="transition-colors hover:text-cf-blue-bright">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone}`} className="transition-colors hover:text-cf-blue-bright">
                  {contact.phone}
                </a>
              </li>
            )}
          </ul>

          {socialLinks.length > 0 && (
            <ul className="mt-5 flex items-center gap-3" aria-label="Social media">
              {socialLinks.map(({ key, href, label, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noopener noreferrer"}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cf-border text-cf-gray transition-colors hover:border-cf-purple hover:text-cf-blue-bright"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="border-t border-cf-border">
        <Container className="flex flex-col-reverse items-center gap-3 py-6 text-xs text-cf-gray-dim sm:flex-row sm:justify-between">
          <p>
            © {year} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="transition-colors hover:text-cf-blue-bright">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="transition-colors hover:text-cf-blue-bright">
              Terms of Service
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
