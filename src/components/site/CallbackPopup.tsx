import { useEffect, useState } from "react";
import { X, ShieldCheck, Users, MapPin } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";

export function CallbackPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 500); // Trigger shortly after page load

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closePopup}
      />

      {/* Popup Modal Box */}
      <div className="relative bg-[#1C0624] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fade-up z-10 overflow-x-hidden overflow-y-auto max-h-[90svh]">
        {/* Subtle radial glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,134,11,0.12),rgba(0,0,0,0))] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 p-1.5 text-primary-foreground/60 hover:text-primary-foreground rounded-full hover:bg-white/5 transition z-20"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {/* Header Tagline with Gold Divider Lines */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-6 bg-gold/50" />
            <span className="text-gold text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">
              Get a Callback
            </span>
            <div className="h-[1px] w-6 bg-gold/50" />
          </div>

          <h3 className="font-display text-2xl md:text-3xl text-primary-foreground text-center font-semibold">
            Speak to our plot advisor
          </h3>
          <p className="text-xs md:text-sm text-primary-foreground/75 mt-2 text-center max-w-sm mx-auto leading-relaxed">
            Tell us what you're looking for — we'll match you with the right plot within 24 hours.
          </p>

          {/* Benefits Bullet List */}
          <div className="mt-5 mb-6 space-y-2.5 text-xs md:text-sm text-primary-foreground/80 max-w-xs mx-auto">
            <p className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Your details are confidential — we don't spam.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-gold shrink-0" />
              <span>Talk to a real advisor, never a bot.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span>Free site visit arranged on request.</span>
            </p>
          </div>

          {/* Embedded Callback Form */}
          <EnquiryForm compact />
        </div>
      </div>
    </div>
  );
}
