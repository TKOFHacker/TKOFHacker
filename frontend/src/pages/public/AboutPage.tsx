import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    { icon: '🎙️', title: 'Voice First', desc: 'We believe access to opportunity shouldn\'t depend on owning a smartphone. Livora works on any phone.' },
    { icon: '🤝', title: 'Human Centered', desc: 'Our AI listens, understands context, and speaks your language — making technology feel personal.' },
    { icon: '🌱', title: 'Growth Oriented', desc: 'Every interaction moves you forward — from skill discovery to training, certification, and employment.' },
    { icon: '🏛️', title: 'Public Good', desc: 'Livora connects people with government schemes, subsidized training, and community opportunities.' },
  ];

  const impacts = [
    { number: '12,400+', label: 'Lives touched across communities' },
    { number: '48,000+', label: 'Voice conversations conducted' },
    { number: '93%', label: 'Opportunity match accuracy' },
    { number: '850+', label: 'Communities actively served' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-hero text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            About Livora
          </h1>
          <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto">
            Livora is an AI-powered livelihood platform that helps people discover their skills,
            bridge gaps, and find the right opportunities — all through their voice.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="livora-card text-center">
            <h2 className="text-2xl font-bold text-dark mb-4">Our Mission</h2>
            <p className="text-muted text-lg leading-relaxed">
              To empower every individual — regardless of their device, language, or location —
              with AI-driven insight into their abilities, and a clear pathway to better livelihood.
              We believe that the journey from <strong className="text-primary">where you are</strong> to{' '}
              <strong className="text-primary">where you want to be</strong> should be guided, not guessed.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-y border-soft-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-dark text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-dark text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <div key={i} className="livora-card text-center">
                <p className="text-3xl font-extrabold text-primary mb-1">{item.number}</p>
                <p className="text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16 bg-white border-y border-soft-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-dark mb-6">The Livora Journey</h2>
          <p className="text-muted text-lg mb-10">Listen → Understand → Discover → Learn → Grow</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {['Listen', 'Understand', 'Discover', 'Learn', 'Grow'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    i === 4 ? 'bg-accent text-dark' : 'bg-primary'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-dark">{step}</span>
                </div>
                {i < 4 && <span className="hidden sm:block text-muted">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
