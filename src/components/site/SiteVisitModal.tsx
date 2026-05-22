import { useState } from "react";
import { X, Calendar, Clock, Sparkles } from "lucide-react";
import { whatsappHref } from "./WhatsAppButton";

interface SiteVisitModalProps {
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SiteVisitModal({ projectName, isOpen, onClose }: SiteVisitModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;

    setLoading(true);

    // Prepare pre-filled WhatsApp message
    const msg = `Hi MK Developers, I am ${name} (Phone: ${phone}). I would like to book a site visit for "${projectName}" on ${date} (${timeSlot} slot). Please confirm.`;
    const href = whatsappHref(msg);

    setTimeout(() => {
      setLoading(false);
      window.open(href, "_blank");
      onClose();
    }, 400);
  };

  const fieldCls =
    "w-full px-4 py-3 rounded-md bg-background border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-card-hover animate-fade-up z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-1 text-gold text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Gated Community Site Visit
          </div>
          <h3 className="font-display text-2xl text-foreground">Book site visit</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Schedule a free site tour of{" "}
            <span className="font-semibold text-foreground">{projectName}</span>. Cab pickup and
            drop can be arranged.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Select Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${fieldCls} pr-8`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className={fieldCls}
              >
                <option value="Morning">Morning (9AM - 12PM)</option>
                <option value="Afternoon">Afternoon (12PM - 3PM)</option>
                <option value="Evening">Evening (3PM - 6PM)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-md gold-gradient text-gold-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60"
          >
            <Calendar className="w-4 h-4" />
            {loading ? "Scheduling..." : "Confirm & Send WhatsApp"}
          </button>
        </form>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          Site visits are fully customized. A dedicated layout manager will accompany you.
        </p>
      </div>
    </div>
  );
}
