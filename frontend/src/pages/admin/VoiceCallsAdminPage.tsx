import React, { useEffect, useState } from 'react';
import { Phone, Play, Volume2, Globe, Clock, ShieldCheck, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';

export const VoiceCallsAdminPage: React.FC<{ onOpenCallModal: () => void }> = ({ onOpenCallModal }) => {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCalls() {
      try {
        const res = await api.admin.getCalls();
        if (res.success && res.data) {
          setCalls(res.data);
        }
      } catch (err) {
        console.error('Calls error', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalls();
  }, []);

  const playSyntheticAudio = (call: any) => {
    setPlayingId(call.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToPlay = call.transcript_summary || 'IVR consultation call recording audio stream.';
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.lang = call.language === 'ta' ? 'ta-IN' : (call.language === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-dark">IVR Voice Call Logs & Recordings</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Carrier-level call sessions (Twilio / Exotel webhooks) capturing spoken audio and transcripts.
          </p>
        </div>

        <button
          onClick={onOpenCallModal}
          className="px-4 py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-card"
        >
          <Phone className="w-3.5 h-3.5" /> Trigger Test Call
        </button>
      </div>

      <div className="space-y-4">
        {calls.map((call) => (
          <div
            key={call.id}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-dark">{call.beneficiary_name}</h3>
                    <span className="font-mono text-xs text-muted">({call.caller_phone})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted mt-0.5 font-medium">
                    <span>SID: {call.call_sid}</span>
                    <span>• {call.provider}</span>
                    <span>• {call.created_at}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs px-3 py-1 rounded-full bg-ivory border border-soft-border text-dark font-bold uppercase">
                  Lang: {call.language}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold">
                  Sentiment: {call.sentiment}
                </span>
              </div>
            </div>

            {/* Transcript Summary */}
            <div className="p-4 rounded-2xl bg-ivory border border-soft-border text-xs text-dark space-y-1">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
                AI Transcription & Semantic Summary:
              </span>
              <p className="leading-relaxed font-medium">{call.transcript_summary}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-soft-border/70 text-xs">
              <span className="text-muted flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" /> Call Duration: {call.duration_seconds} Seconds
              </span>

              <button
                onClick={() => playSyntheticAudio(call)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  playingId === call.id
                    ? 'bg-secondary text-white border-secondary animate-pulse'
                    : 'bg-ivory hover:bg-soft-border text-primary border-soft-border'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{playingId === call.id ? 'Playing Voice Stream...' : 'Play Audio Recording'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
