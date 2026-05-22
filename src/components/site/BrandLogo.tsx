export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon: a gold/plum icon containing the letters "MK" */}
      <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#DFC160] to-[#B8860B] shadow-md border border-[#EDD47A]/30 flex-shrink-0">
        {/* Plum circle accent inside */}
        <div className="absolute inset-[2px] rounded-md bg-[#200A2C] flex items-center justify-center">
          <span className="font-display font-bold text-base md:text-lg tracking-wider text-[#DFC160]">
            MK
          </span>
        </div>
      </div>

      {/* Text: MK Builders & Developers */}
      <div className="flex flex-col justify-center leading-none">
        <span className="font-display font-extrabold text-sm md:text-base tracking-[0.08em] text-[#DFC160] uppercase">
          MK Builders
        </span>
        <span className="font-sans font-semibold text-[9px] md:text-[10px] tracking-[0.18em] text-white/90 uppercase mt-0.5">
          & Developers
        </span>
      </div>
    </div>
  );
}
