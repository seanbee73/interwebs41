import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const Footer: React.FC = () => {
  const { content, setIsAdminOpen } = useSiteContent();
  const contactInfo = content.contactInfo || { email: 'interwebs41@gmail.com' };

  return (
    <footer className="relative z-10 bg-[var(--bg-alt)] border-t border-[var(--glass-border)] py-12 px-5 sm:px-8">
      <div className="container-custom flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <a href="#" className="font-display text-xl font-bold tracking-widest text-[var(--text)]">
            {content.hero?.title || 'InterWebs41'}<span className="text-[var(--accent)] font-extrabold text-2xl">.</span>
          </a>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-2">
            {content.hero?.title || 'InterWebs41'} — {content.hero?.studioBadge || 'AI Web Development Studio'}
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-1 max-w-sm font-light leading-relaxed">
            Crafting digital strategy, intuitive UI/UX design, performant web development, and cohesive brand identities.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-3">
              Navigation
            </span>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#capabilities" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#work" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a href="#process" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-3">
              Connect
            </span>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a
                  href="https://www.facebook.com/interwebs41"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://sites.google.com/view/939pro/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                >
                  Google Portfolio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-custom mt-12 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-[var(--text-dim)] gap-3">
        <span>© {new Date().getFullYear()} {content.hero?.title || 'InterWebs41'}. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Crafted with passion &amp; modern WebGL technologies</span>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono text-[11px]"
            title="Open Website Admin CMS"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin CMS</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
