import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[88px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
