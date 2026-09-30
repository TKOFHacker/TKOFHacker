import React from 'react';
import { Settings, Globe, Shield, Volume2, Smartphone, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('nav.settings')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Configure linguistic preferences, voice synthesis parameters, and data privacy safeguards.
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-base sm:text-lg text-dark flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" /> Preferred Native Language
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Select the primary language for voice prompts, telephone IVR conversations, and screen content:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { code: 'ta', label: 'தமிழ் (Tamil)', desc: 'சென்னை & தமிழ்நாடு வழக்கு' },
              { code: 'en', label: 'English', desc: 'Standard Indian English' },
              { code: 'hi', label: 'हिंदी (Hindi)', desc: 'उत्तर भारतीय क्षेत्रीय बोली' }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as any)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 ${
                  language === l.code
                    ? 'border-primary bg-primary text-white shadow-card'
                    : 'border-soft-border bg-ivory text-muted hover:border-secondary/40 hover:bg-white'
                }`}
              >
                <div className={`font-extrabold text-base ${language === l.code ? 'text-white' : 'text-dark'}`}>{l.label}</div>
                <div className={`text-xs mt-1 ${language === l.code ? 'text-white/80' : 'text-muted'}`}>{l.desc}</div>
                {language === l.code && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-accent">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Telephony & Accessibility Mode */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-base sm:text-lg text-dark flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-secondary" /> Voice & Telephony Defaults
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-muted">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-ivory border border-soft-border">
              <div>
                <span className="font-bold text-dark block">Auto-play Voice Prompts</span>
                <span className="text-xs text-muted">Read questions aloud automatically for low-literacy convenience</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-ivory border border-soft-border">
              <div>
                <span className="font-bold text-dark block">Voice Waveform Feedback</span>
                <span className="text-xs text-muted">Show dynamic visualizer waveforms while speaking</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded" />
            </div>
          </div>
        </div>

        {/* Privacy & DPDP Act 2023 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-3">
          <h3 className="font-extrabold text-base sm:text-lg text-dark flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> DPDP Act 2023 Citizen Safeguards
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Your voice audio data is processed strictly for extracting vocational qualifications and mapping government welfare schemes. Phone numbers are masked across all administrative logs. You may request data erasure at any time via the district nodal cell.
          </p>
        </div>
      </div>
    </div>
  );
};
