import React, { useEffect, useState } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, CheckCircle2, 
  Send, Sparkles, Building2, Search 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Job } from '../../types';

export const JobRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<number | null>(null);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const res = await api.jobs.recommended(beneficiaryId);
        if (res.success && res.data) {
          setJobs(res.data);
        }
      } catch (err) {
        console.error('Jobs fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [beneficiaryId]);

  const handleApply = async (jobId: number) => {
    setApplying(jobId);
    try {
      const res = await api.jobs.apply(jobId, beneficiaryId);
      if (res.success) {
        setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (err) {
      console.error('Job apply error', err);
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('jobsPage.title') || t('nav.jobs')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          {t('jobsPage.subtitle')}
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const isApplied = appliedJobs[job.id];
          return (
            <div
              key={job.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    {job.match_score || 95}% {t('jobsPage.matchScore')}
                  </span>
                  <span className="text-xs text-muted font-medium">• {job.vacancies} {t('jobsPage.openings')}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">{job.title}</h3>
                <div className="text-xs text-secondary font-bold">{job.company_name}</div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary_range}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-muted" /> {job.experience_required}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                  {job.description}
                </p>

                {/* AI Match Reasons */}
                {job.match_reasons && job.match_reasons.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {job.match_reasons.map((reason, i) => (
                      <span key={i} className="text-xs bg-ivory text-dark font-medium px-2.5 py-1 rounded-lg border border-soft-border flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-secondary" /> {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto shrink-0">
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied || applying === job.id}
                  className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-ivory text-secondary border border-secondary/30'
                      : 'bg-primary hover:bg-primary-900 text-white shadow-card'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> {t('jobsPage.appliedBtn')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {t('jobsPage.applyBtn')}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
