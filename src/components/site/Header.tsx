import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/plots/all", label: "Plots" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-primary/85 backdrop-blur-lg border-white/10 shadow-lg"
          : "bg-primary/40 backdrop-blur-md border-white/5"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14 md:h-16">
        <Link to="/" className="flex items-center group">
          <img
            src={logo}
            alt="MX Developer & Builders logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {nav.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className="text-xs lg:text-sm font-medium text-primary-foreground/85 hover:text-gold transition relative"
                activeProps={{ className: "text-gold font-semibold" }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-md gold-gradient text-gold-foreground font-semibold text-xs hover:opacity-90 transition shadow-md"
          >
            Enquire Now
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-primary-foreground p-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-[#1A1A2E] border-l border-white/10 p-6 shadow-2xl animate-fade-up">
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} className="text-primary-foreground p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-3 text-primary-foreground/90 hover:text-gold hover:bg-white/5 rounded-md font-medium"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-6 block text-center px-5 py-3 rounded-md gold-gradient text-gold-foreground font-semibold"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
