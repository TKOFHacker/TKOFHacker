import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Headphones } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const content = {
    en: {
      title: 'Contact & Support',
      subtitle: 'Need assistance or looking to partner as an employer, training provider, or administrative agency? We are here to help.',
      cellTitle: 'Livora National Livelihood Cell',
      tollFree: 'Toll-Free Telephony',
      tollFreeSub: 'Available 24x7 in English, Tamil & Hindi',
      officialEmail: 'Official Support Desk',
      officialEmailSub: 'Responses within 1 business day',
      fieldNode: 'National Operations Center',
      fieldNodeAddress: 'Livora Skill Mission, Electronic City, Bengaluru, Karnataka - 560100',
      hours: 'Support Hours',
      hoursDesc: 'Monday to Saturday: 8:00 AM – 8:00 PM IST',
      sentTitle: 'Inquiry Submitted',
      sentDesc: 'Thank you for reaching out to Livora. Our team will review your message and connect with you shortly.',
      fullName: 'Full Name',
      namePlaceholder: 'e.g. Rajesh Kumar / Priya Sundaram',
      phone: 'Phone Number',
      phonePlaceholder: '+91 98765 43210',
      message: 'Message or Partnership Request',
      messagePlaceholder: 'Please describe how we can assist you or your organization...',
      submit: 'Submit Inquiry',
      sendAnother: 'Send another message'
    },
    ta: {
      title: 'தொடர்பு & உதவி',
      subtitle: 'உதவி தேவையா அல்லது வேலை வழங்குநர் அல்லது பயிற்சி நிறுவனமாக இணைய விரும்புகிறீர்களா? நாங்கள் உதவ தயாராக உள்ளோம்.',
      cellTitle: 'Livora தேசிய வாழ்வாதார மையம்',
      tollFree: 'இலவச தொலைபேசி எண்',
      tollFreeSub: 'தமிழ், இந்தி & ஆங்கிலத்தில் 24x7 கிடைக்கும்',
      officialEmail: 'அதிகாரப்பூர்வ மின்னஞ்சல்',
      officialEmailSub: '1 வணிக நாளுக்குள் பதில் அளிக்கப்படும்',
      fieldNode: 'தேசிய செயல்பாட்டு மையம்',
      fieldNodeAddress: 'Livora திறன் மையம், எலக்ட்ரானிக் சிட்டி, பெங்களூரு - 560100',
      hours: 'உதவி நேரம்',
      hoursDesc: 'திங்கள் முதல் சனி வரை: காலை 8:00 – இரவு 8:00 IST',
      sentTitle: 'செய்தி அனுப்பப்பட்டது',
      sentDesc: 'Livora-வை தொடர்பு கொண்டதற்கு நன்றி. எங்கள் குழு விரைவில் உங்களுடன் தொடர்பு கொள்ளும்.',
      fullName: 'முழு பெயர்',
      namePlaceholder: 'எ.கா. ராஜேஷ் குமார் / பிரியா சுந்தரம்',
      phone: 'தொலைபேசி எண்',
      phonePlaceholder: '+91 98765 43210',
      message: 'செய்தி அல்லது கோரிக்கை',
      messagePlaceholder: 'உங்களுக்கு நாங்கள் எவ்வாறு உதவலாம் என்பதை விவரிக்கவும்...',
      submit: 'விண்ணப்பிக்கவும்',
      sendAnother: 'மற்றொரு செய்தி அனுப்பவும்'
    },
    hi: {
      title: 'संपर्क और सहायता',
      subtitle: 'क्या आपको सहायता चाहिए या आप नियोक्ता, प्रशिक्षण प्रदाता या भागीदार के रूप में जुड़ना चाहते हैं? हम आपकी सेवा में तत्पर हैं।',
      cellTitle: 'Livora राष्ट्रीय आजीविका प्रकोष्ठ',
      tollFree: 'टोल-फ्री टेलीफोनी',
      tollFreeSub: 'अंग्रेज़ी, तमिल और हिंदी में 24x7 उपलब्ध',
      officialEmail: 'आधिकारिक सहायता डेस्क',
      officialEmailSub: '1 कार्यदिवस के भीतर उत्तर',
      fieldNode: 'राष्ट्रीय संचालन केंद्र',
      fieldNodeAddress: 'Livora स्किल मिशन, इलेक्ट्रॉनिक सिटी, बेंगलुरु, कर्नाटक - 560100',
      hours: 'सहायता समय',
      hoursDesc: 'सोमवार से शनिवार: प्रातः 8:00 – सायं 8:00 IST',
      sentTitle: 'संदेश प्राप्त हुआ',
      sentDesc: 'Livora से संपर्क करने के लिए धन्यवाद। हमारी टीम शीघ्र ही आपसे संपर्क करेगी।',
      fullName: 'पूरा नाम',
      namePlaceholder: 'उदा. राजेश कुमार / प्रिया सुंदरम',
      phone: 'फोन नंबर',
      phonePlaceholder: '+91 98765 43210',
      message: 'संदेश या साझेदारी अनुरोध',
      messagePlaceholder: 'कृपया बताएं कि हम आपकी किस प्रकार सहायता कर सकते हैं...',
      submit: 'संदेश भेजें',
      sendAnother: 'एक और संदेश भेजें'
    }
  };

  const current = content[language] || content.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide">
          <Headphones className="w-3.5 h-3.5 text-secondary" />
          <span>HELP & SUPPORT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-dark tracking-tight">
          {current.title}
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          {current.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-soft-border shadow-card space-y-6">
            <h3 className="font-bold text-lg text-dark border-b border-soft-border pb-4">
              {current.cellTitle}
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
                    {current.tollFree}
                  </span>
                  <a href="tel:18005550199" className="text-base font-bold text-primary hover:underline">
                    1800-555-0199
                  </a>
                  <span className="text-xs text-muted block mt-0.5">{current.tollFreeSub}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
                    {current.officialEmail}
                  </span>
                  <a href="mailto:support@livora.org" className="text-base font-bold text-secondary hover:underline">
                    support@livora.org
                  </a>
                  <span className="text-xs text-muted block mt-0.5">{current.officialEmailSub}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
                    {current.hours}
                  </span>
                  <span className="text-sm font-semibold text-dark block">
                    {current.hoursDesc}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted block uppercase tracking-wider">
                    {current.fieldNode}
                  </span>
                  <span className="text-sm text-dark font-medium leading-relaxed block">
                    {current.fieldNodeAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-soft-border shadow-card">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-dark text-xl">{current.sentTitle}</h4>
              <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                {current.sentDesc}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', phone: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-ivory text-primary border border-soft-border hover:bg-soft-border font-semibold rounded-xl text-xs transition"
              >
                {current.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-dark block mb-1.5">{current.fullName}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-4 py-3 text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary focus:bg-white transition"
                  placeholder={current.namePlaceholder}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-dark block mb-1.5">{current.phone}</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-4 py-3 text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary focus:bg-white transition"
                  placeholder={current.phonePlaceholder}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-dark block mb-1.5">{current.message}</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-4 py-3 text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary focus:bg-white transition resize-none"
                  placeholder={current.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card"
              >
                <Send className="w-4 h-4" />
                <span>{current.submit}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
