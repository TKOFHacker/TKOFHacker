import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, Award, MapPin, Clock, DollarSign, 
  CheckCircle2, Building, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrainingProgram } from '../../types';

export const TrainingRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [enrolledMap, setEnrolledMap] = useState<Record<number, boolean>>({});
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadTrainings() {
      setLoading(true);
      try {
        const res = await api.training.recommended(beneficiaryId);
        if (res.success && res.data) {
          setTrainings(res.data);
        }
      } catch (err) {
        console.error('Training fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainings();
  }, [beneficiaryId]);

  const handleEnroll = async (tId: number) => {
    setEnrolling(tId);
    try {
      const res = await api.training.enroll(tId, beneficiaryId);
      if (res.success) {
        setEnrolledMap((prev) => ({ ...prev, [tId]: true }));
      }
    } catch (err) {
      console.error('Enroll error', err);
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('trainingPage.title') || t('nav.training')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          {t('trainingPage.subtitle')}
        </p>
      </div>

      {/* Training Cards */}
      <div className="space-y-4">
        {trainings.map((tItem) => {
          const isEnrolled = enrolledMap[tItem.id];
          return (
            <div
              key={tItem.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    {tItem.match_score || 96}% {t('trainingPage.skillMatch')}
                  </span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {t('trainingPage.freeGovt')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">{tItem.title}</h3>
                <div className="text-xs text-muted font-bold">{tItem.provider_name}</div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {tItem.duration}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {tItem.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-secondary">
                    <DollarSign className="w-3.5 h-3.5" /> {tItem.stipend}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                  {tItem.description}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs text-primary font-semibold">
                  <Award className="w-4 h-4 text-secondary shrink-0" />
                  <span>{t('trainingPage.certification')} {tItem.certification}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto shrink-0">
                <button
                  onClick={() => handleEnroll(tItem.id)}
                  disabled={isEnrolled || enrolling === tItem.id}
                  className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    isEnrolled
                      ? 'bg-ivory text-secondary border border-secondary/30'
                      : 'bg-secondary hover:bg-secondary-600 text-white shadow-card'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> {t('trainingPage.enrolledBtn')}
                    </>
                  ) : (
                    t('trainingPage.enrollBtn')
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
