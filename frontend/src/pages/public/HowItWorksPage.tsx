import React from 'react';
import { Phone, Mic, Cpu, Compass, Award, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const HowItWorksPage: React.FC<{ onOpenCallModal: () => void }> = ({ onOpenCallModal }) => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'How Livora Works',
      subtitle: 'From a simple voice call to your next sustainable livelihood — an intelligent, accessible end-to-end journey.',
      steps: [
        {
          num: '01',
          title: 'Voice Connection & Instant Routing',
          desc: 'Dial toll-free 1800-555-0199 from any phone or tap the mic on your browser. Zero setup, instant response.',
          icon: Phone,
          tag: 'Universal Access'
        },
        {
          num: '02',
          title: 'Language & Dialect Selection',
          desc: 'Choose your preferred language: Tamil (தமிழ்), Hindi (हिंदी), or English. Livora speaks and understands naturally.',
          icon: Mic,
          tag: '3 Supported Languages'
        },
        {
          num: '03',
          title: 'AI Conversational Discovery',
          desc: 'Speak freely about your daily work, tools you use, education, and career aspirations in a friendly interview.',
          icon: Cpu,
          tag: 'Adaptive Voice AI'
        },
        {
          num: '04',
          title: 'Skill Extraction & Validation',
          desc: 'Our AI translates spoken work experience into verified competency levels, building a professional profile for you.',
          icon: Compass,
          tag: 'Competency Framework'
        },
        {
          num: '05',
          title: 'Skill Gap Diagnostic',
          desc: 'Livora benchmarks your capabilities against desired roles to pinpoint exact skills needed for advancement.',
          icon: Award,
          tag: 'Personalized Diagnostic'
        },
        {
          num: '06',
          title: 'Tailored Livelihood Pathway',
          desc: 'Receive immediate recommendations for verified job openings, free accredited training, and govt financial schemes.',
          icon: CheckCircle2,
          tag: 'Actionable Opportunities'
        }
      ],
      ctaTitle: 'Ready to try Livora Voice?',
      ctaSub: 'Experience how anyone with a standard phone or browser can build a career roadmap in minutes.',
      ctaBtn: 'Launch Phone Simulator',
      featurePhoneNote: 'Works seamlessly on feature phones (keypad) with IVR and on smartphones/web.'
    },
    ta: {
      title: 'Livora எப்படி செயல்படுகிறது',
      subtitle: 'எளிய போன் அழைப்பிலிருந்து நிலையான வாழ்வாதாரம் வரை — எளிமையான, முழுமையான வழிமுறை.',
      steps: [
        {
          num: '01',
          title: 'குரல் இணைப்பு & உடனடி உதவி',
          desc: '1800-555-0199 என்ற இலவச எண்ணை அழைக்கவும் அல்லது பிரவுசரில் மைக்கை அழுத்தவும். எந்தவொரு போனுக்கும் பொருந்தும்.',
          icon: Phone,
          tag: 'அனைவருக்கும் அணுகல்'
        },
        {
          num: '02',
          title: 'மொழி தேர்வு',
          desc: 'உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்: தமிழ், இந்தி அல்லது ஆங்கிலம். Livora இயல்பாகப் பேசும்.',
          icon: Mic,
          tag: '3 மொழிகள் ஆதரவு'
        },
        {
          num: '03',
          title: 'AI குரல் உரையாடல்',
          desc: 'உங்கள் அன்றாட வேலை, அனுபவம், கல்வி மற்றும் எதிர்கால இலக்குகள் பற்றி இயல்பாகப் பேசுங்கள்.',
          icon: Cpu,
          tag: 'இயற்கை AI குரல்'
        },
        {
          num: '04',
          title: 'திறன் பிரித்தெடுத்தல்',
          desc: 'உங்கள் பேச்சுப் பதில்களிலிருந்து திறன்கள் துல்லியமாக அடையாளம் காணப்பட்டு சரிபார்க்கப்பட்ட சுயவிவரமாக மாறுகிறது.',
          icon: Compass,
          tag: 'திறன் கட்டமைப்பு'
        },
        {
          num: '05',
          title: 'திறன் இடைவெளி பகுப்பாய்வு',
          desc: 'நீங்கள் விரும்பும் பணிக்கு இன்னும் என்ன திறன்கள் தேவை என்பதை Livora துல்லியமாக கண்டறிகிறது.',
          icon: Award,
          tag: 'தனிப்பயன் பகுப்பாய்வு'
        },
        {
          num: '06',
          title: 'வாழ்வாதார பாதை & வாய்ப்புகள்',
          desc: 'சரிபார்க்கப்பட்ட வேலை வாய்ப்புகள், இலவச பயிற்சி மற்றும் அரசு மானிய திட்டங்களுக்கான உடனடி வழிகாட்டல்.',
          icon: CheckCircle2,
          tag: 'உடனடி வாய்ப்புகள்'
        }
      ],
      ctaTitle: 'Livora குரல் உதவியை சோதிக்க தயாரா?',
      ctaSub: 'சாதாரண போன் அல்லது பிரவுசர் மூலம் எவரும் நிமிடங்களில் தொழில் வழிகாட்டலை எவ்வாறு பெறலாம் என்பதை அனுபவியுங்கள்.',
      ctaBtn: 'போன் சிமுலேட்டரை திறக்கவும்',
      featurePhoneNote: 'ஸ்மார்ட்போன் தேவையில்லை — சாதாரண பட்டன் போனிலும் செயல்படும்.'
    },
    hi: {
      title: 'Livora कैसे काम करता है',
      subtitle: 'एक साधारण फोन कॉल से आपकी स्थायी आजीविका तक — एक सुगम और समग्र मार्गदर्शन यात्रा।',
      steps: [
        {
          num: '01',
          title: 'वॉयस कनेक्शन और त्वरित उत्तर',
          desc: 'टोल-फ्री नंबर 1800-555-0199 डायल करें या ब्राउज़र में माइक दबाएं। किसी भी फोन से तुरंत शुरू करें।',
          icon: Phone,
          tag: 'सार्वभौमिक पहुंच'
        },
        {
          num: '02',
          title: 'भाषा चयन',
          desc: 'अपनी पसंदीदा भाषा चुनें: हिंदी, तमिल या अंग्रेज़ी। Livora स्वाभाविक रूप से समझता और बोलता है।',
          icon: Mic,
          tag: '3 भाषाओं में उपलब्ध'
        },
        {
          num: '03',
          title: 'AI संवादात्मक मूल्यांकन',
          desc: 'अपने दैनिक कार्य, अनुभव, शिक्षा और भविष्य के लक्ष्यों के बारे में खुलकर बातचीत करें।',
          icon: Cpu,
          tag: 'अनुकूलनीय वॉयस AI'
        },
        {
          num: '04',
          title: 'कौशल पहचान और सत्यापन',
          desc: 'आपकी बातचीत से कौशल को निकालकर एक सत्यापित डिजिटल प्रोफ़ाइल तैयार की जाती है।',
          icon: Compass,
          tag: 'दक्षता ढांचा'
        },
        {
          num: '05',
          title: 'कौशल अंतराल विश्लेषण',
          desc: 'Livora आपके वर्तमान कौशल की तुलना इच्छित कार्य से करके आवश्यक सुधार बिंदुओं को चिन्हित करता है।',
          icon: Award,
          tag: 'सटीक विश्लेषण'
        },
        {
          num: '06',
          title: 'आजीविका मार्ग और अवसर',
          desc: 'सत्यापित नौकरियों, निःशुल्क सरकारी प्रशिक्षण और वित्तीय सहायता योजनाओं के लिए त्वरित मार्गदर्शन पाएं।',
          icon: CheckCircle2,
          tag: 'प्रत्यक्ष अवसर'
        }
      ],
      ctaTitle: 'Livora वॉयस आज़माने के लिए तैयार हैं?',
      ctaSub: 'अनुभव करें कि कोई भी व्यक्ति साधारण फोन या वेब से कैसे अपना करियर रोडमैप बना सकता है।',
      ctaBtn: 'फोन सिम्युलेटर शुरू करें',
      featurePhoneNote: 'स्मार्टफोन की आवश्यकता नहीं — साधारण कीपैड फोन पर भी पूर्णतः सक्रिय।'
    }
  };

  const current = content[language] || content.en;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>LIVORA WORKFLOW</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-dark tracking-tight">
          {current.title}
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {current.subtitle}
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {current.steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-soft-border shadow-card hover:shadow-card-hover transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-ivory text-muted border border-soft-border">
                      {step.tag}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-primary/40">
                      {step.num}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-soft-border/60 flex items-center gap-1.5 text-xs font-semibold text-secondary">
                <span>Phase {step.num} of 06</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-primary text-white p-8 sm:p-12 relative overflow-hidden shadow-elevated">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accessible to 100% of citizens</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {current.ctaTitle}
          </h3>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            {current.ctaSub}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenCallModal}
              className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-500 text-dark font-bold rounded-xl shadow-glow-accent transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{current.ctaBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <p className="text-xs text-white/60 pt-2">
            {current.featurePhoneNote}
          </p>
        </div>
      </div>
    </div>
  );
};
