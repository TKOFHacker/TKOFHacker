import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Language, UserRole } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCallModal: () => void;
}

const LivoraLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </div>
    <div className="flex flex-col text-left">
      <span className="text-xl font-black text-primary tracking-tight leading-none">Livora</span>
      <span className="text-[10px] font-semibold text-secondary tracking-wide uppercase mt-0.5">AI Livelihood</span>
    </div>
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenCallModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, loginAs, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const langs: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'தமிழ்', native: 'தமிழ்' },
    { code: 'hi', label: 'हिंदी', native: 'हिंदी' },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';

  const publicLinks = [
    { key: 'home', page: 'landing' },
    { key: 'about', page: 'about' },
    { key: 'howItWorks', page: 'how-it-works' },
    { key: 'contact', page: 'contact' },
  ];

  const beneficiaryLinks = [
    { key: 'home', page: 'landing', icon: '🏠' },
    { key: 'dashboard', page: 'dashboard', icon: '📊' },
    { key: 'voiceAssistant', page: 'voice-assistant', icon: '🎙️' },
    { key: 'skills', page: 'skills', icon: '⚡' },
    { key: 'skillGap', page: 'skill-gap', icon: '📈' },
    { key: 'roadmap', page: 'roadmap', icon: '🗺️' },
    { key: 'jobs', page: 'jobs', icon: '💼' },
    { key: 'training', page: 'training', icon: '🎓' },
    { key: 'schemes', page: 'schemes', icon: '🏛️' },
  ];

  const adminLinks = [
    { key: 'dashboard', page: 'admin-dashboard', icon: '📊', customLabel: t('nav.dashboard') },
    { key: 'admin-beneficiaries', page: 'admin-beneficiaries', icon: '👥', customLabel: t('admin.beneficiaryDirBtn') || 'Users' },
    { key: 'admin-calls', page: 'admin-calls', icon: '🎙️', customLabel: t('admin.callLogsBtn') || 'Voice Logs' },
    { key: 'admin-assessments', page: 'admin-assessments', icon: '📝', customLabel: t('admin.completedAssessments') || 'Assessments' },
    { key: 'admin-analytics', page: 'admin-analytics', icon: '📈', customLabel: t('admin.dashboardTitle') || 'Analytics' },
  ];

  const navLinks = isAdmin
    ? adminLinks
    : isEmployer
    ? [{ key: 'employer-dashboard', page: 'employer-dashboard', customLabel: t('nav.dashboard') }]
    : isLoggedIn
    ? beneficiaryLinks
    : publicLinks;

  const handleRoleSwitch = async (role: UserRole) => {
    await loginAs(role);
    const defaultPages: Record<UserRole, string> = {
      beneficiary: 'dashboard',
      admin: 'admin-dashboard',
      employer: 'employer-dashboard',
    };
    onNavigate(defaultPages[role]);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm" role="banner">
      {/* 1. TOP UTILITY BAR (Inspired by modern institutional platforms & reference image) */}
      <div className="bg-[#0B2520] text-white border-b border-[#183F37] text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Official Platform Identity */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-emerald-100/90 truncate">
              {t('topbar.mission')}
            </span>
          </div>

          {/* Right: Helpline, Email, and Spacious Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Toll-Free Helpline */}
            <a
              href="tel:18005550199"
              className="hidden md:flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-100/80 hover:text-white transition"
              title="Toll-free voice line"
            >
              <span className="text-secondary font-bold">📞</span>
              <span>
                {t('topbar.tollFree')}: <strong className="text-white font-extrabold tracking-wide">1800-555-0199</strong>
              </span>
            </a>

            {/* Email Contact */}
            <a
              href="mailto:support@livora.org"
              className="hidden lg:flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-100/80 hover:text-white transition border-l border-white/15 pl-4"
            >
              <span>✉</span>
              <span>{t('topbar.email')}</span>
            </a>

            {/* Dedicated Spacious Language Switcher */}
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-3">
              <span className="hidden sm:inline text-[11px] text-white/70 font-medium">
                🌐 {t('topbar.language')}:
              </span>
              <div className="inline-flex rounded-lg bg-black/30 p-0.5 border border-white/15">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      language === l.code
                        ? 'bg-accent text-dark shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    title={l.label}
                    aria-label={`Switch language to ${l.label}`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-soft-border" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo */}
            <button
              onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
              className="flex-shrink-0 focus:outline-none"
              aria-label="Livora Home"
            >
              <LivoraLogo />
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto">
              {navLinks.map((link) => {
                const label = 'customLabel' in link && (link as any).customLabel
                  ? (link as any).customLabel
                  : t('nav.' + link.key);
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                        : 'text-muted hover:text-dark hover:bg-ivory'
                    }`}
                  >
                    {'icon' in link && <span className="text-base shrink-0">{(link as any).icon}</span>}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Action Section */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Talk to Livora CTA Button */}
              {isLoggedIn && !isAdmin && (
                <button
                  onClick={() => onNavigate('voice-assistant')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-900 text-white text-sm font-bold shadow-card transition-all active:scale-95 whitespace-nowrap"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  <span>{t('nav.talkToLivora') || 'Talk to Livora'}</span>
                </button>
              )}

              {/* Profile / Auth Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-soft-border hover:border-secondary/30 hover:bg-ivory transition-all"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-sm">
                    {user?.full_name?.[0] || 'K'}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-dark max-w-[110px] truncate">
                    {user?.full_name || t('nav.login')}
                  </span>
                  <svg className={`w-4 h-4 text-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-soft-border p-2 z-50">
                    {isLoggedIn && (
                      <div className="px-3 py-2.5 border-b border-soft-border mb-1.5">
                        <p className="text-sm font-bold text-dark">{user?.full_name}</p>
                        <p className="text-xs text-muted capitalize">{user?.role} • {user?.district || ''}</p>
                      </div>
                    )}

                    {isLoggedIn && user?.role === 'beneficiary' && (
                      <>
                        <button
                          onClick={() => { onNavigate('profile'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-ivory transition-all text-left"
                        >
                          👤 {t('nav.profile')}
                        </button>
                        <button
                          onClick={() => { onNavigate('notifications'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-ivory transition-all text-left"
                        >
                          🔔 {t('nav.notifications')}
                        </button>
                        <button
                          onClick={() => { onNavigate('applications'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-ivory transition-all text-left"
                        >
                          📋 {t('nav.applications')}
                        </button>
                        <button
                          onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-ivory transition-all text-left"
                        >
                          ⚙️ {t('nav.settings')}
                        </button>
                      </>
                    )}

                    <div className="border-t border-soft-border mt-1.5 pt-1.5">
                      <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">Switch Role</p>
                      <button
                        onClick={() => handleRoleSwitch('beneficiary')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${user?.role === 'beneficiary' ? 'bg-primary/10 text-primary font-bold' : 'text-dark hover:bg-ivory'}`}
                      >
                        👤 Citizen User
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${user?.role === 'admin' ? 'bg-primary/10 text-primary font-bold' : 'text-dark hover:bg-ivory'}`}
                      >
                        🔧 Administrator
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('employer')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${user?.role === 'employer' ? 'bg-primary/10 text-primary font-bold' : 'text-dark hover:bg-ivory'}`}
                      >
                        🏢 Training / Employer
                      </button>
                    </div>

                    {isLoggedIn && (
                      <div className="border-t border-soft-border mt-1.5 pt-1.5">
                        <button
                          onClick={() => { logout(); onNavigate('landing'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                        >
                          ↩ {t('nav.logout')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-ivory transition-all"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-soft-border space-y-3">
              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between p-3 bg-ivory rounded-2xl border border-soft-border">
                <span className="text-xs font-bold text-dark flex items-center gap-1.5">
                  🌐 <span>{t('topbar.language')}:</span>
                </span>
                <div className="inline-flex rounded-xl bg-white p-1 border border-soft-border">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        language === l.code ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const label = 'customLabel' in link && (link as any).customLabel
                    ? (link as any).customLabel
                    : t('nav.' + link.key);
                  const isActive = currentPage === link.page;
                  return (
                    <button
                      key={link.page}
                      onClick={() => { onNavigate(link.page); setIsMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-muted hover:text-dark hover:bg-ivory'
                      }`}
                    >
                      {'icon' in link && <span className="text-lg">{(link as any).icon}</span>}
                      <span>{label}</span>
                    </button>
                  );
                })}

                {isLoggedIn && !isAdmin && (
                  <button
                    onClick={() => { onNavigate('voice-assistant'); setIsMobileMenuOpen(false); }}
                    className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-card"
                  >
                    🎙️ {t('nav.talkToLivora') || 'Talk to Livora'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
