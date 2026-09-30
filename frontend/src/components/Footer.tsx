import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Livora</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {(t as any).brand?.tagline || 'Your Voice. Your Skills. Your Next Step.'}
            </p>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-lg">📞</span>
              <div>
                <p className="text-xs text-white/60">Toll-Free Helpline</p>
                <p className="text-sm font-semibold">1800-555-0199</p>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: (t as any).nav?.voiceAssistant || 'Talk to Livora', page: 'voice-assistant' },
                { label: (t as any).nav?.skills || 'My Skills', page: 'skills' },
                { label: (t as any).nav?.skillGap || 'Skill Gap', page: 'skill-gap' },
                { label: (t as any).nav?.roadmap || 'My Pathway', page: 'roadmap' },
              ].map((item) => (
                <li key={item.page}>
                  <button onClick={() => onNavigate(item.page)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Opportunities</h3>
            <ul className="space-y-2.5">
              {[
                { label: (t as any).nav?.jobs || 'Opportunities', page: 'jobs' },
                { label: (t as any).nav?.training || 'Training', page: 'training' },
                { label: (t as any).nav?.schemes || 'Govt. Support', page: 'schemes' },
                { label: (t as any).nav?.selfEmployment || 'Self Employment', page: 'self-employment' },
              ].map((item) => (
                <li key={item.page}>
                  <button onClick={() => onNavigate(item.page)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: (t as any).nav?.about || 'About', page: 'about' },
                { label: (t as any).nav?.howItWorks || 'How It Works', page: 'how-it-works' },
                { label: (t as any).nav?.contact || 'Contact', page: 'contact' },
              ].map((item) => (
                <li key={item.page}>
                  <button onClick={() => onNavigate(item.page)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Livora. Empowering livelihoods through voice and AI.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
