import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState, useEffect } from "react";

import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/plots/residential", label: "Plots" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-primary/30 backdrop-blur-sm"
      }`}
    >
      <div className="hidden md:flex items-center justify-end gap-6 px-8 py-1.5 text-xs text-primary-foreground/70 border-b border-white/10">
        <a href="tel:+919999999999" className="flex items-center gap-1.5 hover:text-gold transition">
          <Phone className="w-3 h-3" /> +91 99999 99999
        </a>
        <span>info@mkdevelopers.in</span>
      </div>

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-20">
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="MX Developer & Builders logo" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition relative"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-md gold-gradient text-gold-foreground font-semibold text-sm hover:opacity-90 transition shadow-md"
          >
            Enquire Now
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-primary-foreground p-2"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-primary p-6 animate-fade-up">
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
                    className="block py-3 px-3 text-primary-foreground hover:text-gold hover:bg-white/5 rounded-md font-medium"
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
