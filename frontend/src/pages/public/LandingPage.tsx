import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sparkles, Mic, Briefcase, Award, ShieldCheck, ArrowRight, PhoneCall, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenCallModal: () => void;
}

const VoiceWaveVisual: React.FC = () => (
  <div className="flex items-center justify-center gap-1.5 h-16">
    {[16, 28, 42, 30, 48, 24, 38, 20, 32, 44, 22, 34].map((h, i) => (
      <div
        key={i}
        className="voice-bar voice-bar-accent shadow-lg shadow-accent/40"
        style={{
          height: `${h}px`,
          animation: `wave 1.4s ease-in-out ${i * 0.1}s infinite alternate`,
        }}
      />
    ))}
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenCallModal }) => {
  const { t } = useLanguage();
  const hero = (t as any).hero || {};
  const workflow = (t as any).workflow || {};
  const brand = (t as any).brand || {};

  return (
    <div className="relative overflow-hidden bg-3d-mesh min-h-screen">
      {/* ============ 3D HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-gradient-hero text-white pb-24 lg:pb-32 pt-16 lg:pt-24">
        {/* Animated ambient glowing 3D background orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/30 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        {/* 3D Geometric Grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            
            {/* Left Column: Hero Text & Actions */}
            <div className="text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-accent shadow-lg">
                <Sparkles className="w-4 h-4 text-accent animate-spinSlow" />
                <span>Next-Gen 3D Livelihood AI Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-md">
                {hero.title || 'Your Voice. Your Skills. Your Next Step.'}
              </h1>

              <p className="text-lg sm:text-xl text-white/85 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                {hero.subtitle || 'Discover the skills, opportunities and pathways that can move your livelihood forward.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => onNavigate('voice-assistant')}
                  className="livora-btn livora-btn-accent text-lg shadow-2xl hover:scale-105 transition-transform"
                  id="hero-talk-btn"
                >
                  <Mic className="w-5 h-5 text-dark" />
                  <span>{hero.talkToLivora || 'Talk to Livora'}</span>
                </button>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="livora-btn livora-btn-secondary text-lg border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-md"
                  id="hero-explore-btn"
                >
                  <span>{hero.exploreOpportunities || 'Explore Opportunities'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: 3D Interactive Visual Stage */}
            <div className="relative flex justify-center lg:justify-end perspective-container">
              <div className="relative w-full max-w-md lg:max-w-none flex justify-center">

                {/* 3D Floating Feature Glass Card 1 - Top Left */}
                <div className="hidden sm:flex absolute -left-6 top-4 z-30 items-center gap-3 p-3.5 px-5 rounded-2xl glass-panel-3d shadow-2xl animate-float-slow border border-white/60">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-dark">100% Free & Verified</p>
                    <p className="text-[11px] text-muted">Official Govt. Schemes</p>
                  </div>
                </div>

                {/* 3D Floating Feature Glass Card 2 - Bottom Right */}
                <div className="hidden sm:flex absolute -right-4 bottom-2 z-30 items-center gap-3 p-3.5 px-5 rounded-2xl glass-panel-3d shadow-2xl animate-float-medium border border-white/60">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-dark">94% Skill Match</p>
                    <p className="text-[11px] text-muted">AI Career Diagnostic</p>
                  </div>
                </div>

                {/* Main 3D Sphere & Voice Visual Stage */}
                <div className="relative z-20 flex flex-col items-center justify-center">
                  {/* Outer Glowing Halo Rings */}
                  <div className="absolute inset-0 -m-10 rounded-full bg-accent/20 blur-2xl animate-pulse-glow" />
                  <div className="absolute inset-0 -m-16 rounded-full bg-secondary/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

                  {/* Glass 3D Stage Circle */}
                  <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-2xl flex flex-col items-center justify-center gap-5 p-6 transform-style-3d hover:rotate-2 transition-transform">
                    <div className="livora-mic-btn cursor-pointer" onClick={() => onNavigate('voice-assistant')}>
                      <Mic className="w-10 h-10 text-white" />
                    </div>

                    <VoiceWaveVisual />

                    <div className="text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-accent bg-dark/40 px-3 py-1 rounded-full border border-accent/30">
                        Tri-Lingual Voice AI
                      </span>
                      <p className="text-xs text-white/80 font-medium mt-2">Tamil • Hindi • English</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ FEATURE PHONE BANNER ============ */}
      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4">
        <div className="glass-panel-3d rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-accent/20 via-white/90 to-secondary/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-accent text-dark flex items-center justify-center text-2xl font-bold shadow-lg shadow-accent/30 flex-shrink-0">
                <PhoneCall className="w-7 h-7 text-dark" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-dark">
                  {hero.featurePhoneBanner || 'No smartphone? You can still talk to Livora through a phone call.'}
                </h4>
                <p className="text-xs sm:text-sm text-muted mt-0.5 font-medium">
                  {hero.featurePhoneSub || 'Dial toll-free 1800-555-0199 from any phone anytime.'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCallModal}
              className="livora-btn livora-btn-accent text-sm whitespace-nowrap shadow-lg hover:scale-105"
              id="feature-phone-cta"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{hero.testSimulator || 'Try Phone Call'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS - 3D CARDS ============ */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-dark tracking-tight">
              {workflow.sectionTitle || 'How Livora Works'}
            </h2>
            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
              {workflow.sectionSubtitle || 'From your voice to your next opportunity — in four simple steps.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-container">
            {[
              { step: 1, icon: '🎙️', title: workflow.step1 || 'Speak', desc: workflow.step1Desc || 'Talk naturally in Tamil, Hindi, or English about your field experience.' },
              { step: 2, icon: '🔍', title: workflow.step2 || 'Discover', desc: workflow.step2Desc || 'AI automatically extracts your informal skills and maps competencies.' },
              { step: 3, icon: '📊', title: workflow.step3 || 'Analyze', desc: workflow.step3Desc || 'Get real-time diagnostic of skill gaps and target career paths.' },
              { step: 4, icon: '🌱', title: workflow.step4 || 'Grow', desc: workflow.step4Desc || 'Access free certified training, vetted jobs, and bank subsidies.' },
            ].map((item) => (
              <div
                key={item.step}
                className="livora-card-3d p-8 relative flex flex-col justify-between group hover:-translate-y-3 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-ivory border border-soft-border flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="w-9 h-9 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md">
                      0{item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-dark">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-soft-border/60 flex items-center text-xs font-bold text-secondary gap-1 group-hover:text-primary">
                  <span>Step 0{item.step} Pathway</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============ STATS COUNTER - 3D GLASS ============ */}
      <section className="py-16 relative bg-white/70 backdrop-blur-lg border-y border-soft-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '12,400+', label: hero.stats?.beneficiaries || 'People Empowered', icon: '👥' },
              { value: '48,000+', label: hero.stats?.voiceCalls || 'Voice Conversations', icon: '🎙️' },
              { value: '93%', label: hero.stats?.matchRate || 'Opportunity Match Rate', icon: '🎯' },
              { value: '850+', label: hero.stats?.ruralReach || 'Communities Reached', icon: '🏘️' },
            ].map((stat, i) => (
              <div key={i} className="livora-card p-6 text-center border-soft-border hover:shadow-xl transition-shadow">
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <p className="text-3xl sm:text-4xl font-black text-primary mb-1 tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOTTOM CTA BOX ============ */}
      <section className="py-24 relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-hero text-white p-10 sm:p-16 text-center shadow-2xl border border-white/20">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.2s' }} />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md">
              Ready to Discover Your Path?
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto font-normal">
              Just speak. Livora listens, understands, and guides you to the right opportunities in your language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => onNavigate('voice-assistant')}
                className="livora-btn livora-btn-accent text-lg shadow-xl hover:scale-105"
              >
                <Mic className="w-5 h-5 text-dark" />
                <span>{hero.talkToLivora || 'Talk to Livora'}</span>
              </button>
              <button
                onClick={onOpenCallModal}
                className="livora-btn livora-btn-secondary bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-md"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{hero.testSimulator || 'Try Phone Call'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

