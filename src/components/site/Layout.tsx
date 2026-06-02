import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { ExitIntentPopup } from "./ExitIntentPopup";
import { CallbackPopup } from "./CallbackPopup";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-[120px] min-h-screen text-foreground">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ExitIntentPopup />
      <CallbackPopup />
    </>
  );
}
