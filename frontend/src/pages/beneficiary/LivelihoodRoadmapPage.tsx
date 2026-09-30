import React, { useEffect, useState } from 'react';
import { 
  Compass, CheckCircle2, Circle, Clock, ArrowRight, 
  Sparkles, Award, Briefcase, Building, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LivelihoodRoadmap, RoadmapStep } from '../../types';

export const LivelihoodRoadmapPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [roadmap, setRoadmap] = useState<LivelihoodRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const beneficiaryId = user?.beneficiary_id || 1;

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const res = await api.roadmap.get(beneficiaryId);
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Roadmap fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [beneficiaryId]);

  const toggleStep = async (step: RoadmapStep) => {
    setIsUpdating(step.id);
    const newStatus = !step.is_completed;
    try {
      const res = await api.roadmap.updateStepProgress(step.id, newStatus);
      if (res.success && res.data) {
        setRoadmap((prev) => {
          if (!prev) return null;
          const updatedSteps = prev.steps.map((s) =>
            s.id === step.id ? { ...s, is_completed: newStatus } : s
          );
          return {
            ...prev,
            completed_steps: res.data.completed_steps,
            progress_percentage: res.data.progress_percentage,
            steps: updatedSteps
          };
        });
      }
    } catch (err) {
      console.error('Toggle step error', err);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-soft-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-secondary" />
              <span>{t('roadmap.title')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
              {roadmap?.goal_title || 'Certified Electrician & Self-Employed Contractor'}
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              {t('roadmap.subtitle')}
            </p>
          </div>

          <div className="text-left sm:text-right bg-ivory sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-soft-border w-full sm:w-auto">
            <div className="text-3xl font-black text-primary">
              {roadmap?.progress_percentage || 17}%
            </div>
            <div className="text-xs font-semibold text-muted">
              {roadmap?.completed_steps || 1} / {roadmap?.total_steps || 6} {t('roadmap.completed')}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-ivory border border-soft-border rounded-full h-3.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-secondary to-primary h-3.5 rounded-full transition-all duration-700"
            style={{ width: `${roadmap?.progress_percentage || 17}%` }}
          />
        </div>
      </div>

      {/* Visual Timeline of Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-soft-border">
        {roadmap?.steps?.map((step) => {
          const isDone = step.is_completed;
          return (
            <div key={step.id} className="relative group">
              {/* Timeline Dot Indicator */}
              <div
                onClick={() => toggleStep(step)}
                className={`absolute -left-6 sm:-left-8 top-4 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition shadow-md z-10 ${
                  isDone
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-white border-2 border-soft-border text-muted hover:border-secondary'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
              </div>

              {/* Step Card */}
              <div
                className={`bg-white p-6 sm:p-7 rounded-2xl border transition-all duration-200 ${
                  isDone
                    ? 'border-secondary/30 bg-secondary/5 shadow-sm'
                    : 'border-soft-border shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {t('roadmap.step')} {step.step_order}
                    </span>
                    <h3 className={`font-bold text-base sm:text-lg ${isDone ? 'text-primary' : 'text-dark'}`}>
                      {step.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {step.expected_duration}
                    </span>
                    <button
                      onClick={() => toggleStep(step)}
                      disabled={isUpdating === step.id}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                        isDone
                          ? 'bg-ivory text-primary border border-soft-border hover:bg-soft-border'
                          : 'bg-primary hover:bg-primary-900 text-white shadow-sm'
                      }`}
                    >
                      {isDone ? t('roadmap.completed') : t('roadmap.markDone')}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {step.description}
                </p>

                {/* Contextual Action Link based on Action Type */}
                <div className="pt-3 mt-3 border-t border-soft-border/70 flex items-center justify-between text-xs">
                  <span className="text-muted font-medium capitalize">{step.action_type.replace('_', ' ')}</span>
                  {step.action_type === 'training' && (
                    <button
                      onClick={() => onNavigate('training')}
                      className="text-secondary font-bold hover:underline flex items-center gap-1"
                    >
                      {t('roadmap.exploreTraining')} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {step.action_type === 'job_application' && (
                    <button
                      onClick={() => onNavigate('jobs')}
                      className="text-secondary font-bold hover:underline flex items-center gap-1"
                    >
                      {t('roadmap.browseJobs')} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {step.action_type === 'business_launch' && (
                    <button
                      onClick={() => onNavigate('schemes')}
                      className="text-secondary font-bold hover:underline flex items-center gap-1"
                    >
                      {t('roadmap.applySubsidy')} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
