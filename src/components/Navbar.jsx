import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";
import Container from "./Container";
import { nav } from "../config/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-white" : "text-cf-gray hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-cf-border bg-cf-bg/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(139,92,246,0.25)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cf-purple/60 to-transparent"
      />
      <Container className="flex h-18 items-center justify-between py-3.5">
        <Logo />

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {nav.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:block">
          <Button to="/contact" size="md">
            Request a Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-cf-border p-2 text-white xl:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={`xl:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="flex flex-col gap-1 border-t border-cf-border bg-cf-bg pb-6 pt-4">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive ? "bg-cf-surface text-white" : "text-cf-gray hover:bg-cf-surface hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button to="/contact" size="md" className="mt-3 w-full" onClick={() => setMobileOpen(false)}>
            Request a Quote
          </Button>
        </Container>
      </div>
    </header>
  );
}
