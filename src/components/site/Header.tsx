import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/site/BrandLogo";

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
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#1C0624]/95 backdrop-blur-lg border-white/10 shadow-lg"
            : "bg-[#1C0624]/90 lg:bg-[#1C0624]/40 lg:backdrop-blur-md border-white/5"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14 md:h-16">
          <Link to="/" className="flex items-center group">
            <BrandLogo />
          </Link>

          <ul className="hidden min-[960px]:flex items-center gap-3.5 xl:gap-6">
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
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full gold-gradient text-gold-foreground font-semibold text-xs hover:opacity-90 transition shadow-md"
            >
              Enquire Now
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="min-[960px]:hidden text-primary-foreground p-2 rounded-full hover:bg-white/5 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay - rendered outside header to bypass viewport height & filter constraints */}
      {open && (
        <div className="fixed inset-0 z-[60] min-[960px]:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-0 right-0 h-dvh w-72 border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between"
            style={{ backgroundColor: "#1C0624" }}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <BrandLogo />
                <button
                  onClick={() => setOpen(false)}
                  className="text-primary-foreground p-2 rounded-full hover:bg-white/5 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {nav.map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="block py-2.5 px-4 text-primary-foreground/90 hover:text-gold hover:bg-white/5 rounded-full font-medium transition text-sm"
                      activeProps={{ className: "text-gold font-semibold bg-white/5" }}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block text-center px-5 py-3 rounded-full gold-gradient text-gold-foreground font-semibold shadow-md transition hover:opacity-95 text-sm"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
