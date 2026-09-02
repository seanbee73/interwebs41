import React, { useState } from 'react';
import { Camera, Mail, Phone, Link as LinkIcon, Check, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface PricingProps {
  onSelectPackage: (packageName: string, estimatedPrice: number) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  const { content } = useSiteContent();
  const pricingPackages = content.pricing || [];
  const contactInfo = content.contactInfo || { email: 'interwebs41@gmail.com', phone: '850-361-8984' };

  const [selectedPackageId, setSelectedPackageId] = useState<string>(pricingPackages[1]?.id || 'classic');

  const handleApplyPackage = (title: string, priceStr: string) => {
    const numPrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 750;
    onSelectPackage(`${title} (${priceStr})`, numPrice);

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="section relative z-10 container-custom">
      <div className="section-tag mb-4">Services &amp; Packages</div>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-4">
        Pricing &amp; Investment
      </h2>
      <p className="text-base sm:text-lg text-[var(--text-muted)] mb-8 max-w-2xl font-light">
        Transparent investment options designed for exceptional digital experiences and media production.
      </p>

      {/* Direct Contact Bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-12 p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text-muted)]">
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
        >
          <Mail className="w-4 h-4 text-[var(--accent)]" />
          <span>{contactInfo.email}</span>
        </a>
        <span className="hidden sm:inline text-[var(--glass-border)]">|</span>
        <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors">
          <Phone className="w-4 h-4 text-[var(--accent)]" />
          <span>{contactInfo.phone}</span>
        </a>
        <span className="hidden sm:inline text-[var(--glass-border)]">|</span>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
        >
          <LinkIcon className="w-4 h-4 text-[var(--accent)]" />
          <span>facebook.com/dubstar939</span>
        </a>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pricingPackages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`glass-card p-8 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                pkg.isPopular
                  ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/40 bg-[var(--accent)]/5'
                  : 'hover:border-[var(--glass-border)]'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute top-4 right-4 bg-[var(--accent)] text-[#060606] text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Camera className="w-6 h-6 text-[var(--accent)]" />
                  <h3 className="font-display text-2xl font-bold text-[var(--text)]">{pkg.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-light min-h-[36px] mb-4">{pkg.subtitle}</p>

                <div className="mb-6 border-b border-[var(--glass-border)] pb-6">
                  <span className="font-display text-4xl font-extrabold text-[var(--accent)]">{pkg.price}</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--text)] font-light mb-8">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyPackage(pkg.title, pkg.price);
                }}
                className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  pkg.isPopular
                    ? 'bg-[var(--accent)] text-[#060606] shadow-lg hover:shadow-[0_0_20px_var(--accent-glow)]'
                    : 'bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                <span>Select {pkg.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
