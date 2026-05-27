import { useEffect, useState } from "react";
import { X, Sparkles, PhoneCall } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check session storage so we don't annoy the user repeatedly
    const dismissed = sessionStorage.getItem("exit_popup_dismissed");
    if (dismissed === "true") return;

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY < 20 generally means the user moved their cursor up towards the tab bar
      if (e.clientY < 20) {
        setShow(true);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const closePopup = () => {
    setShow(false);
    sessionStorage.setItem("exit_popup_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closePopup} />

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-card-hover animate-fade-up z-10 overflow-y-auto max-h-[90svh]">
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80 transition"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="inline-flex w-12 h-12 rounded-full gold-gradient items-center justify-center text-gold-foreground mb-3 shadow-md">
            <PhoneCall className="w-5 h-5" />
          </span>
          <div className="flex items-center justify-center gap-1.5 text-gold text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Exclusive Offer Inside
          </div>
          <h3 className="font-display text-3xl text-foreground">Before you go...</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Book a site visit today and get a free pickup/drop arranged. Leave your details and
            we'll call you back!
          </p>
        </div>

        <EnquiryForm compact />

        <p className="text-[10px] text-center text-muted-foreground mt-4 leading-normal">
          * Offers valid only for layout bookings this week. Free consultation included.
        </p>
      </div>
    </div>
  );
}
