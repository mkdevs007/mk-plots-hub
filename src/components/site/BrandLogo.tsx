import logoUrl from "@/assets/logo.png";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Glassmorphic wrapping container */}
      <div className="relative group overflow-hidden px-3.5 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#DFC160]/30 hover:bg-white/10 transition-all duration-500 shadow-md">
        {/* Subtle gold radial background glow on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,193,96,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image logo */}
        <img
          src={logoUrl}
          alt="MK Builders & Developers Logo"
          className="h-7 md:h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}
