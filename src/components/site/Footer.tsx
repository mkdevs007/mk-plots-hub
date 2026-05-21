import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-md gold-gradient flex items-center justify-center font-display text-xl font-bold text-gold-foreground">M</span>
            <span className="font-display text-2xl">MK <span className="text-gold">Developers</span></span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
            Premium residential, commercial, agricultural & industrial plots across Karnataka. Own your future, plot by plot.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-gold hover:text-gold-foreground hover:border-gold transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/projects" className="hover:text-gold">Projects</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold mb-4">Plot Types</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/plots/residential" className="hover:text-gold">Residential Plots</Link></li>
            <li><Link to="/plots/commercial" className="hover:text-gold">Commercial Plots</Link></li>
            <li><Link to="/plots/agricultural" className="hover:text-gold">Agricultural Plots</Link></li>
            <li><Link to="/plots/industrial" className="hover:text-gold">Industrial Plots</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-gold" /> +91 99999 99999</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-gold" /> 4th Floor, MG Road, Bangalore, Karnataka 560001</li>
          </ul>
          <p className="mt-5 text-xs text-primary-foreground/50 leading-relaxed">
            RERA: PRM/KA/RERA/1251/308/PR/2024<br />
            PRM/KA/RERA/1251/309/PR/2025
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} MK Developers. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
