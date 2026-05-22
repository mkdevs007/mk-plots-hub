import logoUrl from "@/assets/logo.png";

export function BrandLogo({
  className = "",
  scrolled = false,
}: {
  className?: string;
  scrolled?: boolean;
}) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Glassmorphic wrapping container */}
      <div
        className={`relative group overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#DFC160]/30 hover:bg-white/10 transition-all duration-500 shadow-md ${
          scrolled ? "px-3.5 py-1.5" : "px-5 py-2.5"
        }`}
      >
        {/* Subtle gold radial background glow on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,193,96,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image logo */}
        <img
          src={logoUrl}
          alt="MK Builders & Developers Logo"
          className={`w-auto object-contain transition-all duration-500 group-hover:scale-[1.02] ${
            scrolled ? "h-8 min-[960px]:h-10" : "h-11 min-[960px]:h-14"
          }`}
        />
      </div>
    </div>
  );
}
