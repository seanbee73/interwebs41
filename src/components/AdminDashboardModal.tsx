import React, { useState } from 'react';
import {
  X,
  Lock,
  LogOut,
  Mail,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Inbox,
  Layout,
  FileText,
  Briefcase,
  Layers,
  DollarSign,
  Workflow,
  Key,
  ShieldAlert,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { ServiceItem, ProjectItem, PricingPackage } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    content,
    isAdminOpen,
    setIsAdminOpen,
    adminToken,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    updateContent,
    resetContent,
    submissions,
    updateSubmissionStatus,
    deleteSubmission,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'hero' | 'manifesto' | 'services' | 'projects' | 'pricing' | 'process' | 'settings'
  >('inbox');

  // Auth State
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Editable Form Draft State
  const [draftContent, setDraftContent] = useState(content);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Change Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Selected Submission Detail Modal
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Sync draft content when modal opens
  React.useEffect(() => {
    if (isAdminOpen) {
      setDraftContent(content);
    }
  }, [isAdminOpen, content]);

  if (!isAdminOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    const res = await loginAdmin(passcode);
    setIsLoggingIn(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid passcode.');
    } else {
      setPasscode('');
    }
  };

  // Handle Save Content
  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateContent(draftContent);
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle Reset Content
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all site content back to defaults?')) {
      const ok = await resetContent();
      if (ok) {
        setDraftContent(content);
        alert('Site content reset to default!');
      }
    }
  };

  // Handle Password Change
  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    const res = await changeAdminPassword(currentPass, newPass);
    if (res.success) {
      setPassMsg({ text: 'Admin passcode updated successfully!' });
      setCurrentPass('');
      setNewPass('');
    } else {
      setPassMsg({ text: res.error || 'Failed to update passcode.', isError: true });
    }
  };

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[var(--bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--text)]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--glass)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight flex items-center gap-2">
                <span>InterWebs41 CMS Admin</span>
                {adminToken ? (
                  <span className="text-[10px] font-mono uppercase bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full border border-[var(--accent)]/30">
                    Active Session
                  </span>
                ) : null}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-light">
                Manage submissions, live website copy, services, projects, pricing & contact info.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminToken && (
              <button
                onClick={logoutAdmin}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] hover:border-red-400/30 transition-colors"
                title="Log out of admin mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)] transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Challenge (if not logged in) */}
        {!adminToken ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-sm p-8 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-6 text-center shadow-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display">Admin Authentication</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Enter your admin passcode to access the website CMS and inquiries dashboard.</p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-mono text-[var(--text-muted)] uppercase">Admin Passcode</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (Default: admin123)"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none transition-colors"
                />
                <p className="text-[11px] text-[var(--text-dim)] font-mono">Default passcode: <code className="text-[var(--accent)]">admin123</code></p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-[var(--accent)] text-[#060606] font-medium text-sm hover:shadow-[0_0_20px_var(--accent-glow)] transition-all flex items-center justify-center gap-2"
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock Admin Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--glass-border)] bg-[var(--glass)]/50 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'inbox'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Inquiries Inbox</span>
                {submissions.filter((s) => s.status === 'unread').length > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                    {submissions.filter((s) => s.status === 'unread').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Hero & Contact Info</span>
              </button>

              <button
                onClick={() => setActiveTab('manifesto')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'manifesto'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Manifesto & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Services</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Portfolio Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'pricing'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing Packages</span>
              </button>

              <button
                onClick={() => setActiveTab('process')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'process'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Workflow className="w-4 h-4" />
                <span>Process Steps</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap md:mt-auto ${
                  activeTab === 'settings'
                    ? 'bg-[var(--accent)] text-[#060606] shadow-md font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Security & Reset</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Save Bar Notification */}
              {activeTab !== 'inbox' && activeTab !== 'settings' && (
                <div className="sticky top-0 z-20 pb-4 flex items-center justify-between bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--glass-border)]">
                  <span className="text-xs text-[var(--text-muted)]">Editing draft site content. Click save to publish changes live.</span>
                  <div className="flex items-center gap-3">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved live!
                      </span>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#060606] font-medium text-xs hover:shadow-[0_0_15px_var(--accent-glow)] transition-all flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Publish Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 📩 INBOX TAB */}
              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-display">Project Submissions ({submissions.length})</h3>
                      <p className="text-xs text-[var(--text-muted)]">Inquiries submitted via the website contact form.</p>
                    </div>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-[var(--glass-border)] rounded-2xl">
                      <Inbox className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">No submissions received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-[var(--accent)]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{sub.name}</span>
                              <span className="text-xs text-[var(--accent)] font-mono">{sub.email}</span>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                  sub.status === 'unread'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : sub.status === 'replied'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}
                              >
                                {sub.status || 'unread'}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-2">{sub.message}</p>
                            <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-dim)]">
                              <span>Service: {sub.service}</span>
                              <span>Budget: {sub.budget}</span>
                              <span>{new Date(sub.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`mailto:interwebs41@gmail.com?subject=${encodeURIComponent(`Re: [InterWebs41 Inquiry] ${sub.service} - ${sub.name}`)}&body=${encodeURIComponent(`Hi ${sub.name},\n\nThank you for reaching out to InterWebs41 regarding ${sub.service}.\n\n`)}`}
                              onClick={() => updateSubmissionStatus(sub.id, 'replied')}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#060606] transition-colors text-xs font-mono flex items-center gap-1"
                              title="Reply via Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </a>
                            <button
                              onClick={() => setSelectedSubmissionId(sub.id)}
                              className="p-2 rounded-lg bg-[var(--glass-border)] text-[var(--text)] hover:border-[var(--accent)] text-xs font-mono flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this submission?')) deleteSubmission(sub.id);
                              }}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ⚡ HERO & CONTACT TAB */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-display">Hero & Contact Info Config</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Studio Badge</label>
                      <input
                        type="text"
                        value={draftContent.hero.studioBadge}
                        onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, studioBadge: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Headline Title (e.g., InterWebs41)</label>
                      <input
                        type="text"
                        value={draftContent.hero.title}
                        onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, title: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={draftContent.hero.subtitle}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, subtitle: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--glass-border)] pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Primary Email</label>
                      <input
                        type="email"
                        value={draftContent.contactInfo.email}
                        onChange={(e) => setDraftContent({ ...draftContent, contactInfo: { ...draftContent.contactInfo, email: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Phone Number</label>
                      <input
                        type="text"
                        value={draftContent.contactInfo.phone}
                        onChange={(e) => setDraftContent({ ...draftContent, contactInfo: { ...draftContent.contactInfo, phone: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Address / Location</label>
                    <input
                      type="text"
                      value={draftContent.contactInfo.address}
                      onChange={(e) => setDraftContent({ ...draftContent, contactInfo: { ...draftContent.contactInfo, address: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 📖 MANIFESTO & METRICS TAB */}
              {activeTab === 'manifesto' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-display">Manifesto & Key Metrics</h3>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Badge Text</label>
                    <input
                      type="text"
                      value={draftContent.manifesto.badge}
                      onChange={(e) => setDraftContent({ ...draftContent, manifesto: { ...draftContent.manifesto, badge: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Headline Statement</label>
                    <textarea
                      rows={2}
                      value={draftContent.manifesto.title}
                      onChange={(e) => setDraftContent({ ...draftContent, manifesto: { ...draftContent.manifesto, title: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={draftContent.manifesto.paragraph1}
                      onChange={(e) => setDraftContent({ ...draftContent, manifesto: { ...draftContent.manifesto, paragraph1: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={draftContent.manifesto.paragraph2}
                      onChange={(e) => setDraftContent({ ...draftContent, manifesto: { ...draftContent.manifesto, paragraph2: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] focus:border-[var(--accent)] text-sm outline-none"
                    />
                  </div>

                  <div className="border-t border-[var(--glass-border)] pt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
                      <div>
                        <h4 className="font-bold text-sm font-display">Stat Metrics Counters Display</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Toggle whether the stat metric numbers (e.g. Projects Delivered, Clients) appear on the website.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setDraftContent({
                            ...draftContent,
                            showMetrics: draftContent.showMetrics === false ? true : false,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          draftContent.showMetrics !== false ? 'bg-[var(--accent)]' : 'bg-neutral-700'
                        }`}
                        role="switch"
                        aria-checked={draftContent.showMetrics !== false}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#060606] shadow-lg ring-0 transition duration-200 ease-in-out ${
                            draftContent.showMetrics !== false ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {draftContent.showMetrics === false && (
                      <p className="text-xs font-mono text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                        ⚠️ Stat metrics section is currently <strong>hidden</strong> from the public website.
                      </p>
                    )}

                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-opacity ${draftContent.showMetrics === false ? 'opacity-50' : 'opacity-100'}`}>
                      {draftContent.metrics.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-2">
                          <input
                            type="number"
                            value={m.num}
                            onChange={(e) => {
                              const updated = [...draftContent.metrics];
                              updated[idx].num = parseInt(e.target.value) || 0;
                              setDraftContent({ ...draftContent, metrics: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--glass-border)] text-sm font-mono font-bold text-[var(--accent)]"
                          />
                          <input
                            type="text"
                            value={m.label}
                            onChange={(e) => {
                              const updated = [...draftContent.metrics];
                              updated[idx].label = e.target.value;
                              setDraftContent({ ...draftContent, metrics: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 🛠️ SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-display">Services Offered ({draftContent.services.length})</h3>
                    <button
                      onClick={() => {
                        const newService: ServiceItem = {
                          id: `serv_${Date.now()}`,
                          num: `0${draftContent.services.length + 1}`,
                          title: 'New Service Offering',
                          description: 'Description of service offering...',
                          icon: 'Code2',
                          keyDeliverables: ['Deliverable 1', 'Deliverable 2'],
                          timeline: '2-3 Weeks',
                        };
                        setDraftContent({ ...draftContent, services: [...draftContent.services, newService] });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[#060606] text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {draftContent.services.map((service, sIdx) => (
                      <div key={service.id} className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const updated = [...draftContent.services];
                              updated[sIdx].title = e.target.value;
                              setDraftContent({ ...draftContent, services: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-[var(--glass-border)] focus:border-[var(--accent)] outline-none px-1 py-0.5"
                          />
                          <button
                            onClick={() => {
                              const updated = draftContent.services.filter((_, idx) => idx !== sIdx);
                              setDraftContent({ ...draftContent, services: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...draftContent.services];
                            updated[sIdx].description = e.target.value;
                            setDraftContent({ ...draftContent, services: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={service.timeline}
                            onChange={(e) => {
                              const updated = [...draftContent.services];
                              updated[sIdx].timeline = e.target.value;
                              setDraftContent({ ...draftContent, services: updated });
                            }}
                            placeholder="Timeline (e.g. 2-3 Weeks)"
                            className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={service.keyDeliverables.join(', ')}
                            onChange={(e) => {
                              const updated = [...draftContent.services];
                              updated[sIdx].keyDeliverables = e.target.value.split(',').map((s) => s.trim());
                              setDraftContent({ ...draftContent, services: updated });
                            }}
                            placeholder="Deliverables (comma separated)"
                            className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🎨 PORTFOLIO / PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-display">Portfolio Projects ({draftContent.projects.length})</h3>
                    <button
                      onClick={() => {
                        const newProject: ProjectItem = {
                          id: `proj_${Date.now()}`,
                          name: 'New Project',
                          category: 'Immersive Web',
                          image: 'https://images.unsplash.com/photo-1720962158789-9389a4f399da?w=1600&q=80',
                          description: 'Project description here...',
                          year: '2025',
                          link: 'https://interwebs41.com',
                          tags: ['React', 'UI/UX'],
                        };
                        setDraftContent({ ...draftContent, projects: [...draftContent.projects, newProject] });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[#060606] text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {draftContent.projects.map((proj, pIdx) => (
                      <div key={proj.id} className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const updated = [...draftContent.projects];
                              updated[pIdx].name = e.target.value;
                              setDraftContent({ ...draftContent, projects: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-[var(--glass-border)] focus:border-[var(--accent)] outline-none px-1 py-0.5"
                          />
                          <button
                            onClick={() => {
                              const updated = draftContent.projects.filter((_, idx) => idx !== pIdx);
                              setDraftContent({ ...draftContent, projects: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...draftContent.projects];
                              updated[pIdx].category = e.target.value;
                              setDraftContent({ ...draftContent, projects: updated });
                            }}
                            placeholder="Category"
                            className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs"
                          />
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => {
                              const updated = [...draftContent.projects];
                              updated[pIdx].year = e.target.value;
                              setDraftContent({ ...draftContent, projects: updated });
                            }}
                            placeholder="Year"
                            className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                          />
                        </div>

                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => {
                            const updated = [...draftContent.projects];
                            updated[pIdx].image = e.target.value;
                            setDraftContent({ ...draftContent, projects: updated });
                          }}
                          placeholder="Image URL"
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                        />

                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...draftContent.projects];
                            updated[pIdx].description = e.target.value;
                            setDraftContent({ ...draftContent, projects: updated });
                          }}
                          placeholder="Description"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)]"
                        />

                        <input
                          type="text"
                          value={proj.tags.join(', ')}
                          onChange={(e) => {
                            const updated = [...draftContent.projects];
                            updated[pIdx].tags = e.target.value.split(',').map((t) => t.trim());
                            setDraftContent({ ...draftContent, projects: updated });
                          }}
                          placeholder="Tags (comma separated)"
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 💳 PRICING TAB */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-display">Pricing Packages</h3>
                  </div>

                  <div className="space-y-4">
                    {draftContent.pricing.map((pkg, pkgIdx) => (
                      <div key={pkg.id} className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={pkg.title}
                            onChange={(e) => {
                              const updated = [...draftContent.pricing];
                              updated[pkgIdx].title = e.target.value;
                              setDraftContent({ ...draftContent, pricing: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-[var(--glass-border)] outline-none px-1 py-0.5"
                          />
                          <input
                            type="text"
                            value={pkg.price}
                            onChange={(e) => {
                              const updated = [...draftContent.pricing];
                              updated[pkgIdx].price = e.target.value;
                              setDraftContent({ ...draftContent, pricing: updated });
                            }}
                            className="font-mono font-bold text-sm text-[var(--accent)] bg-transparent border-b border-[var(--glass-border)] outline-none px-1 py-0.5 text-right w-24"
                          />
                        </div>

                        <input
                          type="text"
                          value={pkg.subtitle}
                          onChange={(e) => {
                            const updated = [...draftContent.pricing];
                            updated[pkgIdx].subtitle = e.target.value;
                            setDraftContent({ ...draftContent, pricing: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs"
                        />

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[var(--text-muted)]">Features (1 per line)</label>
                          <textarea
                            rows={4}
                            value={pkg.features.join('\n')}
                            onChange={(e) => {
                              const updated = [...draftContent.pricing];
                              updated[pkgIdx].features = e.target.value.split('\n');
                              setDraftContent({ ...draftContent, pricing: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔄 PROCESS TAB */}
              {activeTab === 'process' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-display">Process Workflow Steps</h3>
                  <div className="space-y-4">
                    {draftContent.process.map((proc, prIdx) => (
                      <div key={prIdx} className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[var(--accent)] text-sm">{proc.num}</span>
                          <input
                            type="text"
                            value={proc.title}
                            onChange={(e) => {
                              const updated = [...draftContent.process];
                              updated[prIdx].title = e.target.value;
                              setDraftContent({ ...draftContent, process: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-[var(--glass-border)] outline-none flex-1"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={proc.desc}
                          onChange={(e) => {
                            const updated = [...draftContent.process];
                            updated[prIdx].desc = e.target.value;
                            setDraftContent({ ...draftContent, process: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔐 SECURITY & SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-xl">
                  <h3 className="text-lg font-bold font-display">Security & Site Settings</h3>

                  <form onSubmit={handleChangePass} className="p-6 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-4">
                    <h4 className="font-bold text-sm font-display flex items-center gap-2">
                      <Key className="w-4 h-4 text-[var(--accent)]" />
                      <span>Change Admin Passcode</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Current Passcode</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-muted)]">New Passcode</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] text-xs outline-none"
                      />
                    </div>

                    {passMsg && (
                      <p className={`text-xs ${passMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                        {passMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#060606] font-medium text-xs hover:shadow-lg"
                    >
                      Update Passcode
                    </button>
                  </form>

                  <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                    <h4 className="font-bold text-sm font-display text-red-400 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Factory Reset Website Content</span>
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Reset all website titles, hero texts, services, portfolio items, and pricing back to default values.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium text-xs hover:bg-red-600 transition-colors"
                    >
                      Reset All Content
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Submission Detail Modal overlay */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg)] border border-[var(--glass-border)] space-y-4 shadow-2xl text-[var(--text)]">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <h3 className="font-bold font-display text-base">Inquiry Details</h3>
              <button onClick={() => setSelectedSubmissionId(null)} className="p-1 text-[var(--text-muted)] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Name:</strong> {selectedSubmission.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedSubmission.email}`} className="text-[var(--accent)] hover:underline">{selectedSubmission.email}</a></p>
              <p><strong>Service:</strong> {selectedSubmission.service}</p>
              <p><strong>Budget:</strong> {selectedSubmission.budget}</p>
              <p><strong>Date:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
              <div className="p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Message Body</span>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{selectedSubmission.message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={`mailto:interwebs41@gmail.com?subject=${encodeURIComponent(`Re: [InterWebs41 Inquiry] ${selectedSubmission.service} - ${selectedSubmission.name}`)}&body=${encodeURIComponent(`Hi ${selectedSubmission.name},\n\nThank you for reaching out to InterWebs41 regarding ${selectedSubmission.service}.\n\n`)}`}
                onClick={() => {
                  updateSubmissionStatus(selectedSubmission.id, 'replied');
                  setSelectedSubmissionId(null);
                }}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#060606] font-medium text-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email Reply</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
