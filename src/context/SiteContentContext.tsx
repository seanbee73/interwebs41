import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContent, ContactSubmission } from '../types';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminToken: string | null;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateContent: (newContent: Partial<SiteContent>) => Promise<boolean>;
  resetContent: () => Promise<boolean>;
  submissions: ContactSubmission[];
  refreshSubmissions: () => Promise<void>;
  updateSubmissionStatus: (id: string, status: 'unread' | 'read' | 'replied' | 'archived', notes?: string) => Promise<boolean>;
  deleteSubmission: (id: string) => Promise<boolean>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'iw41_admin_token';

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  // Fetch initial content from API
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Failed to fetch site content from server, using default fallback', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch submissions list
  const refreshSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/contact/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch submissions', err);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    refreshSubmissions();
  }, [fetchContent, refreshSubmissions]);

  // Global keyboard shortcut to open Admin Modal: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Admin Login
  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Incorrect passcode' };
      }
    } catch (err) {
      return { success: false, error: 'Network error connecting to server.' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const changeAdminPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to change passcode.' };
      }
    } catch (err) {
      return { success: false, error: 'Network error.' };
    }
  };

  // Update content on server
  const updateContent = async (newContent: Partial<SiteContent>): Promise<boolean> => {
    try {
      const updatedFull = { ...content, ...newContent };
      setContent(updatedFull);

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminToken ? `Bearer ${adminToken}` : '',
        },
        body: JSON.stringify({ content: updatedFull }),
      });

      if (res.ok) {
        return true;
      } else {
        console.error('Failed to save updated site content');
        return false;
      }
    } catch (err) {
      console.error('Error saving site content', err);
      return false;
    }
  };

  // Reset content to default
  const resetContent = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/content/reset', {
        method: 'POST',
        headers: {
          Authorization: adminToken ? `Bearer ${adminToken}` : '',
        },
      });

      if (res.ok) {
        setContent(DEFAULT_SITE_CONTENT);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Submission management
  const updateSubmissionStatus = async (id: string, status: 'unread' | 'read' | 'replied' | 'archived', notes?: string) => {
    try {
      const res = await fetch(`/api/contact/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (res.ok) {
        await refreshSubmissions();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/submissions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        isAdminOpen,
        setIsAdminOpen,
        adminToken,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateContent,
        resetContent,
        submissions,
        refreshSubmissions,
        updateSubmissionStatus,
        deleteSubmission,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
