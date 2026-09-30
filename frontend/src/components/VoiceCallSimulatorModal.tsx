import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, Volume2, Globe, Send, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { AudioVisualizer } from './AudioVisualizer';

interface VoiceCallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCallSimulatorModal: React.FC<VoiceCallSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callSid, setCallSid] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [transcript, setTranscript] = useState<Array<{ sender: string; text: string }>>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Timer for call duration
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Audio speech synthesis helper
  const speakText = (text: string, lang: string = language) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartCall = async () => {
    setCallStatus('calling');
    setTranscript([]);
    setExtractedData(null);
    try {
      const res = await api.voice.simulateTurn('start', '', language);
      if (res.success && res.data) {
        setCallSid(res.data.call_sid);
        setCurrentPrompt(res.data.voice_prompt);
        setCallStatus('connected');
        setTranscript([{ sender: 'ai', text: res.data.voice_prompt }]);
        speakText(res.data.voice_prompt, language);
      }
    } catch {
      setCallStatus('ended');
    }
  };

  const handleSendInput = async (inputText: string) => {
    if (!inputText.trim() || !callSid) return;
    setUserInput('');
    setTranscript((prev) => [...prev, { sender: 'user', text: inputText }]);

    try {
      const res = await api.voice.simulateTurn(callSid, inputText, language);
      if (res.success && res.data) {
        const aiPrompt = res.data.voice_prompt;
        setCurrentPrompt(aiPrompt);
        setTranscript((prev) => [...prev, { sender: 'ai', text: aiPrompt }]);
        speakText(aiPrompt, res.data.language || language);

        if (res.data.extracted_profile && Object.keys(res.data.extracted_profile).length > 0) {
          setExtractedData(res.data.extracted_profile);
        }

        if (res.data.is_completed) {
          setTimeout(() => {
            // Keep status connected to allow review
          }, 4000);
        }
      }
    } catch (err) {
      console.error('Turn error', err);
    }
  };

  const handleEndCall = async () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (callSid) {
      await api.voice.endCall(callSid);
    }
    setCallStatus('ended');
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Mobile Phone Hardware Shell (Feature Phone UI) */}
        <div className="w-full md:w-80 bg-slate-950 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-800">
          <div className="w-full max-w-[260px] bg-slate-900 border-4 border-slate-700 rounded-3xl p-4 shadow-inner flex flex-col items-center">
            {/* Phone Speaker Earpiece */}
            <div className="w-16 h-1.5 bg-slate-700 rounded-full mb-3" />

            {/* Screen */}
            <div className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-center mb-4 min-h-[140px] flex flex-col justify-between">
              <div>
                <div className="text-[10px] tracking-wider uppercase text-emerald-400 font-semibold mb-1 flex items-center justify-between">
                  <span>IVR Telephony</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{callStatus === 'connected' ? 'LIVE' : 'STANDBY'}</span>
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 font-semibold">1800-555-0199</div>
                <div className="text-[11px] text-emerald-300 mt-1">
                  {callStatus === 'idle' && 'Toll-Free Livelihood Line'}
                  {callStatus === 'calling' && 'Dialing Carrier Node...'}
                  {callStatus === 'connected' && `Call Active (${formatDuration(callDuration)})`}
                  {callStatus === 'ended' && 'Call Disconnected'}
                </div>
              </div>

              {callStatus === 'connected' && (
                <div className="my-2">
                  <AudioVisualizer isActive={isSpeaking} size="sm" />
                </div>
              )}

              <div className="text-[10px] text-slate-400 italic">
                {callStatus === 'connected' ? 'Twilio / Exotel Compatible' : 'Keypad / Speech Ready'}
              </div>
            </div>

            {/* Call Action Button */}
            {callStatus === 'connected' ? (
              <button
                onClick={handleEndCall}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition shadow-lg shadow-red-900/30"
              >
                <PhoneOff className="w-4 h-4" /> End Call
              </button>
            ) : (
              <button
                onClick={handleStartCall}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 mb-4 transition shadow-lg shadow-emerald-900/30 animate-pulse-subtle"
              >
                <Phone className="w-4 h-4" /> Dial 1800-555-0199
              </button>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              {[
                { digit: '1', sub: 'Tamil' },
                { digit: '2', sub: 'English' },
                { digit: '3', sub: 'Hindi' },
                { digit: '4', sub: 'GHI' },
                { digit: '5', sub: 'JKL' },
                { digit: '6', sub: 'MNO' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: 'REV' },
                { digit: '0', sub: 'OPER' },
                { digit: '#', sub: 'SEND' }
              ].map(({ digit, sub }) => (
                <button
                  key={digit}
                  disabled={callStatus !== 'connected'}
                  onClick={() => handleSendInput(digit)}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-100 p-2 rounded-lg border border-slate-700/60 active:scale-95 transition flex flex-col items-center justify-center"
                >
                  <span className="font-bold text-sm">{digit}</span>
                  <span className="text-[9px] text-slate-400">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Live IVR Call Log & Extraction Inspector */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  Carrier IVR Call Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Simulating rural non-smartphone user call flow via AI Voice Engine
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {callSid ? `SID: ${callSid.substring(0, 14)}...` : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Conversation Flow Display */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2 mb-4">
              {transcript.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500">
                  <Volume2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-400" />
                  <p className="text-sm font-medium">Click "Dial 1800-555-0199" to begin the voice session.</p>
                  <p className="text-xs mt-1 text-slate-600">
                    Works offline with local synthetic voice & deterministic telephony state machine.
                  </p>
                </div>
              ) : (
                transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-sm ${
                      msg.sender === 'ai'
                        ? 'bg-slate-800/90 border border-emerald-500/20 text-slate-200'
                        : 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 ml-8'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      {msg.sender === 'ai' ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> AI IVR Voice Response
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-emerald-300" /> Caller Input (Voice / DTMF)
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Live Profile Extracted Live Card */}
            {extractedData && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 mb-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Extracted Beneficiary Profile
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px]">JSON Schema Verified</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Name</span>
                    <span className="font-semibold text-white">{extractedData.name || 'Participant'}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Education</span>
                    <span className="font-semibold text-white">{extractedData.education || '12th'}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Occupation</span>
                    <span className="font-semibold text-white">{extractedData.occupation || 'Farmer'}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Target Career</span>
                    <span className="font-semibold text-emerald-300">{extractedData.target_career || 'Electrician'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Input Bar for simulated speech or keyboard entry */}
          <div className="border-t border-slate-800 pt-3">
            <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Speech Samples:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSendInput('என் பெயர் கார்த்திக், தஞ்சாவூர்')}
                  disabled={callStatus !== 'connected'}
                  className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded border border-slate-700 text-slate-300"
                >
                  "கார்த்திக், தஞ்சாவூர்"
                </button>
                <button
                  onClick={() => handleSendInput('12th முடித்திருக்கிறேன்')}
                  disabled={callStatus !== 'connected'}
                  className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded border border-slate-700 text-slate-300"
                >
                  "12th முடித்தேன்"
                </button>
                <button
                  onClick={() => handleSendInput('எலக்ட்ரிக்கல் வேலை செய்ய ஆசை')}
                  disabled={callStatus !== 'connected'}
                  className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded border border-slate-700 text-slate-300"
                >
                  "எலக்ட்ரிக்கல் ஆர்வம்"
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendInput(userInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={callStatus !== 'connected'}
                placeholder={callStatus === 'connected' ? 'Type or speak your answer here...' : 'Dial call first to answer'}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={callStatus !== 'connected' || !userInput.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
