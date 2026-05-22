import { MessageCircle } from "lucide-react";

export const whatsappHref = (msg?: string) =>
  `https://wa.me/919999999999?text=${encodeURIComponent(
    msg ?? "Hi MK Builders & Developers, I'm interested in your projects — please share details",
  )}`;

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-whatsapp text-white shadow-card-hover flex items-center justify-center hover:scale-110 transition"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
    </a>
  );
}
