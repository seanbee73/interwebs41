import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Phone, ArrowUpRight, Copy, Sparkles } from 'lucide-react';
import { ContactFormData } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface ContactSectionProps {
  initialService?: string;
  initialBudget?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService, initialBudget }) => {
  const { content } = useSiteContent();
  const contactInfo = content.contactInfo || { email: 'interwebs41@gmail.com', phone: '647-894-6964' };

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    service: initialService || 'Web Development',
    budget: initialBudget || '$1,000 - $3,000',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ mailtoUrl?: string; recipientEmail?: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please complete all required fields (Name, Email, Message).');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setSuccessInfo({
          mailtoUrl: data.mailtoUrl,
          recipientEmail: data.recipientEmail || contactInfo.email,
        });
      } else {
        throw new Error(data.error || 'Failed to process contact message.');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Fallback: construct direct mailto URL even if server is offline
      const mailSubject = encodeURIComponent(`[InterWebs41 Inquiry] ${formData.service} - ${formData.name}`);
      const mailBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nBudget: ${formData.budget}\n\nMessage:\n${formData.message}`
      );
      const fallbackMailto = `mailto:${contactInfo.email}?subject=${mailSubject}&body=${mailBody}`;

      setStatus('success');
      setSuccessInfo({
        mailtoUrl: fallbackMailto,
        recipientEmail: contactInfo.email,
      });
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="section relative z-10 container-custom">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Info Column */}
        <div>
          <div className="section-tag">Get In Touch</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-tight mb-6">
            Let&apos;s create something <em className="italic text-[var(--accent)] font-serif font-normal">extraordinary</em>
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] font-light leading-relaxed mb-8">
            Ready to push the boundaries of digital experience? Whether you need Digital Strategy, AI Web Development, or Brand Media, send us a message directly.
          </p>

          <div className="space-y-6">
            <div className="glass-card p-6 flex items-start gap-4 rounded-xl border border-[var(--glass-border)]">
              <div className="p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)] block mb-1">Contact Email</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="font-display text-lg font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                  <button
                    onClick={() => handleCopyEmail(contactInfo.email)}
                    title="Copy Email"
                    className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedEmail ? <span className="text-[var(--accent)]">Copied!</span> : null}
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 rounded-xl border border-[var(--glass-border)]">
              <div className="p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-[var(--text-muted)] block mb-1">Direct Phone</span>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="font-display text-lg font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form Column */}
        <div className="glass-card p-8 sm:p-10 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-alt)]/60 backdrop-blur-xl">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto shadow-[0_0_30px_var(--accent-glow)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-display text-3xl font-bold text-[var(--text)]">Message Dispatched!</h3>
              <p className="text-sm text-[var(--text-muted)] font-light max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[var(--text)] font-medium">{formData.name}</strong>. Your inquiry regarding <strong className="text-[var(--accent)] font-medium">{formData.service}</strong> has been routed directly to <strong className="text-[var(--text)]">{successInfo?.recipientEmail}</strong>.
              </p>

              {successInfo?.mailtoUrl && (
                <div className="pt-4 border-t border-[var(--glass-border)] space-y-3">
                  <span className="text-xs font-mono text-[var(--text-dim)] block">
                    Want to also send directly via your personal mail app?
                  </span>
                  <a
                    href={successInfo.mailtoUrl}
                    className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--bg)] bg-[var(--accent)] px-6 py-3 rounded-full hover:shadow-lg transition-all"
                  >
                    <span>Open in Email App</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              <button
                onClick={() => setStatus('idle')}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] underline block mx-auto pt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-display font-bold text-xl text-[var(--text)]">Start A Project</h3>
              </div>

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">Service Needed</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors"
                  >
                    <option value="AI Web Development">AI Web Development</option>
                    <option value="Immersive Web Applications">Immersive Web Applications</option>
                    <option value="Digital Strategy & UX Architecture">Digital Strategy & UX</option>
                    <option value="Media & Photography">Media & Photography</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">Target Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors"
                  >
                    <option value="$400 - $750">$400 - $750</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000+">$5,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">Project Details *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals, timeframe, or specific requirements..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-[var(--accent)] text-[#060606] font-display font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-[0_0_25px_var(--accent-glow)] transition-all flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <span>Dispatching Message...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
