import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Send, Sparkles, CheckCircle2, 
  ArrowRight, RefreshCw, VolumeX, Shield, Bot, User as UserIcon, Code2
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { AudioVisualizer } from '../../components/AudioVisualizer';

export const AiVoiceAssistantPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, isSpeaking]);

  // Voice speech synthesis
  const speakAI = (text: string) => {
    if (!speechSynthesisEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = 0.95;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const defaultWelcomeMap: Record<string, string> = {
    ta: 'வணக்கம்! நான் உங்கள் AI வாழ்வாதார வழிகாட்டி. உங்கள் பெயர் மற்றும் நீங்கள் வசிக்கும் மாவட்டம் என்ன?',
    hi: 'नमस्ते! मैं आपका AI आजीविका सहायक हूँ। आपका नाम और आपका जिला क्या है?',
    en: 'Hello! I am your AI Livelihood Assistant. What is your full name and which district do you live in?'
  };

  // Start Assessment on mount and on language change
  useEffect(() => {
    const welcome = defaultWelcomeMap[language] || defaultWelcomeMap.en;
    setMessages([{ sender: 'ai', text: welcome }]);
    speakAI(welcome);

    async function initAssessment() {
      try {
        const res = await api.assessment.start(user?.beneficiary_id || 1, language);
        if (res.success && res.data) {
          setAssessmentId(res.data.assessment_id);
          if (res.data.welcome_message) {
            setMessages([{ sender: 'ai', text: res.data.welcome_message }]);
            speakAI(res.data.welcome_message);
          }
        }
      } catch (err) {
        console.error('Assessment start error', err);
      }
    }
    initAssessment();
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [language]);

  // Web Speech Recognition setup
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        handleSimulatedAudioSend();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        handleSimulatedAudioSend();
      }
    } else {
      handleSimulatedAudioSend();
    }
  };

  const handleSimulatedAudioSend = async () => {
    if (!assessmentId) return;
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      try {
        const res = await api.assessment.sendAudio(assessmentId);
        if (res.success && res.data) {
          if (res.data.ai_reply) {
            setMessages((prev) => [
              ...prev,
              { sender: 'user', text: language === 'ta' ? '(குரல் ஆடியோ பெறப்பட்டது)' : language === 'hi' ? '(वॉयस ऑडियो प्राप्त हुआ)' : '(Spoken audio captured)' },
              { sender: 'ai', text: res.data.ai_reply }
            ]);
            speakAI(res.data.ai_reply);
          }
          if (res.data.is_completed) {
            setIsCompleted(true);
            setExtractedProfile(res.data.extracted_profile);
            if (res.data.completion_message) {
              setMessages((prev) => [...prev, { sender: 'ai', text: res.data.completion_message }]);
              speakAI(res.data.completion_message);
            }
          }
        }
      } catch (err) {
        console.error('Audio send error', err);
      }
    }, 1200);
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || !assessmentId) return;
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    try {
      const res = await api.assessment.sendMessage(assessmentId, text);
      if (res.success && res.data) {
        if (res.data.ai_reply) {
          setMessages((prev) => [...prev, { sender: 'ai', text: res.data.ai_reply }]);
          speakAI(res.data.ai_reply);
        }
        if (res.data.is_completed) {
          setIsCompleted(true);
          setExtractedProfile(res.data.extracted_profile);
          if (res.data.completion_message) {
            setMessages((prev) => [...prev, { sender: 'ai', text: res.data.completion_message }]);
            speakAI(res.data.completion_message);
          }
        }
      }
    } catch (err) {
      console.error('Message error', err);
    }
  };

  const quickPills = [
    {
      full: language === 'ta' ? 'என் பெயர் கார்த்திக், 12th முடித்துள்ளேன், தஞ்சாவூர்' : language === 'hi' ? 'मेरा नाम कार्तिक है, 12वीं पास, तंजावुर जिला' : 'My name is Karthik, 12th pass, Thanjavur',
      short: language === 'ta' ? 'கார்த்திக், 12th, தஞ்சாவூர்' : language === 'hi' ? 'कार्तिक, 12वीं, तंजावुर' : 'Karthik, 12th, Thanjavur'
    },
    {
      full: language === 'ta' ? '3 வருடமாக விவசாயம் செய்கிறேன். மின்சார வேலை தெரியும்.' : language === 'hi' ? '3 साल से खेती और बुनियादी बिजली वायरिंग का काम करता हूँ।' : '3 years farming and basic electrical wiring experience.',
      short: language === 'ta' ? 'விவசாயம், மின்சார வேலை' : language === 'hi' ? 'खेती, बिजली काम' : 'Farming, Electrical'
    },
    {
      full: language === 'ta' ? 'எலக்ட்ரீசியன் தொழில் தொடங்க விருப்பம் உள்ளது.' : language === 'hi' ? 'प्रमाणित इलेक्ट्रीशियन बनकर सेवा दुकान खोलना चाहता हूँ।' : 'Want to become a certified electrician and start a shop.',
      short: language === 'ta' ? 'எலக்ட்ரீசியன் தொழில்' : language === 'hi' ? 'इलेक्ट्रीशियन दुकान' : 'Electrician Shop'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Title & Speech Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-dark flex items-center gap-2">
              <Mic className="w-6 h-6 text-primary" />
              {t('voicePage.title') || t('nav.voiceAssistant')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            {t('voicePage.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              speechSynthesisEnabled
                ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                : 'bg-ivory border-soft-border text-muted'
            }`}
          >
            {speechSynthesisEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{speechSynthesisEnabled ? t('voicePage.audioOn') : t('voicePage.audioOff')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Voice Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-soft-border shadow-card flex flex-col h-[600px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none shadow-md font-medium'
                      : 'bg-ivory border border-soft-border text-dark rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-accent/30 text-dark flex items-center justify-center shrink-0 border border-accent/40 font-bold text-xs shadow-sm">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Speaking / Waveform Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory border border-soft-border w-fit shadow-sm">
                <Volume2 className="w-4 h-4 text-secondary animate-bounce" />
                <span className="text-xs font-bold text-secondary">{t('beneficiary.aiSpeaking')}</span>
                <AudioVisualizer isActive={true} size="sm" />
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/20 border border-accent/40 text-dark w-fit animate-pulse shadow-sm">
                <Mic className="w-4 h-4 text-accent-700" />
                <span className="text-xs font-bold">{t('beneficiary.voiceListening')}</span>
                <AudioVisualizer isActive={true} color="bg-accent-600" size="sm" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice / Text Input Tray */}
          <div className="p-4 border-t border-soft-border bg-ivory/60">
            {/* Quick Answer Suggestion Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 text-xs">
              <span className="text-muted py-1 font-semibold shrink-0">
                {t('voicePage.quickSuggestionsLabel')}
              </span>
              {quickPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(pill.full)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-soft-border text-dark border border-soft-border font-semibold shrink-0 transition shadow-sm text-xs"
                >
                  "{pill.short}"
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Record Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-xl flex items-center justify-center transition active:scale-95 ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-lg'
                    : 'bg-primary hover:bg-primary-900 text-white shadow-card'
                }`}
                title={t('beneficiary.voiceMicPrompt')}
                aria-label={t('beneficiary.voiceMicPrompt')}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('voicePage.inputPlaceholder')}
                className="flex-1 bg-white border border-soft-border rounded-xl px-4 py-3 text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary transition shadow-sm"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-3 bg-secondary hover:bg-secondary-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition flex items-center gap-1.5 shadow-card shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Live Structured Profile & Livelihood Pipeline Preview */}
        <div className="space-y-4">
          {/* JSON Extraction Card */}
          <div className="bg-white p-5 rounded-3xl border border-soft-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-dark flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                {t('voicePage.liveJsonTitle')}
              </h3>
              <span className="text-[10px] uppercase font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                {t('voicePage.realTimeBadge')}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {t('voicePage.liveJsonSub')}
            </p>

            <div className="bg-[#172321] p-3.5 rounded-2xl border border-[#233532] text-[11px] font-mono text-emerald-300 max-h-[220px] overflow-y-auto">
              <pre>
                {JSON.stringify(
                  extractedProfile || {
                    name: 'Karthik M.',
                    education: '12th',
                    occupation: 'Farmer',
                    experience_years: 3,
                    skills: ['Farming', 'Basic Electrical'],
                    interests: ['Electrical work', 'Self employment'],
                    location: { state: 'Tamil Nadu', district: 'Thanjavur' },
                    language: language
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          {/* Action Trigger Card after completion */}
          <div className="bg-white p-5 rounded-3xl border border-soft-border shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('voicePage.profileReadyTitle')}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {t('voicePage.profileReadySub')}
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigate('skill-gap')}
                className="w-full py-2.5 bg-ivory hover:bg-soft-border text-dark border border-soft-border rounded-xl font-bold text-xs transition flex items-center justify-between px-3.5"
              >
                <span>{t('voicePage.viewGapBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-between px-3.5 shadow-card"
              >
                <span>{t('voicePage.viewPathwayBtn') || t('beneficiary.viewPathway')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
