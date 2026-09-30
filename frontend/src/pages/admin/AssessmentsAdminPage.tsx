import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Bot, Calendar, Eye, Search, FileCode } from 'lucide-react';
import { api } from '../../services/api';

export const AssessmentsAdminPage: React.FC = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedJson, setSelectedJson] = useState<any>(null);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await api.admin.getAssessments();
        if (res.success && res.data) {
          setAssessments(res.data);
        }
      } catch (err) {
        console.error('Assessments fetch error', err);
      }
    }
    loadAssessments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">AI Assessment Logs & Schema Extractions</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Inspection telemetry of conversational dialogue turns, channel origins, and generated profile JSON schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {assessments.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedJson(a.ai_extracted)}
              className="bg-white p-5 rounded-2xl border border-soft-border shadow-card hover:border-secondary hover:shadow-card-hover cursor-pointer transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-dark">{a.beneficiary_name}</h3>
                  <div className="text-xs text-muted mt-0.5">
                    Channel: <span className="text-primary font-bold">{a.channel}</span> • Lang: <span className="uppercase font-semibold">{a.language}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                  {a.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-soft-border/70">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {a.created_at}
                </span>
                <span className="text-secondary font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Inspect JSON
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* JSON Inspector Panel */}
        <div className="bg-white p-6 rounded-3xl border border-soft-border shadow-card space-y-3 h-fit">
          <h3 className="font-extrabold text-sm text-dark flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" /> Extracted Profile Inspector
          </h3>
          <p className="text-xs text-muted">
            Live extracted schema fields stored in PostgreSQL database:
          </p>
          <div className="p-3.5 bg-[#172321] rounded-xl border border-[#233532] text-[11px] font-mono text-emerald-300 max-h-[360px] overflow-y-auto">
            <pre>
              {JSON.stringify(
                selectedJson || {
                  name: 'Candidate',
                  education: '12th',
                  occupation: 'Farmer',
                  experience_years: 3,
                  skills: ['Farming', 'Basic Electrical'],
                  interests: ['Electrical work', 'Self employment'],
                  location: { state: 'Tamil Nadu', district: 'Thanjavur' },
                  language: 'ta'
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
