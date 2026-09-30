import React, { useEffect, useState } from 'react';
import { 
  Compass, Wrench, DollarSign, ArrowRight, CheckCircle2, 
  Sparkles, TrendingUp, Building 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SelfEmploymentIdea } from '../../types';

export const SelfEmploymentPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [ideas, setIdeas] = useState<SelfEmploymentIdea[]>([]);
  const [loading, setLoading] = useState(true);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadIdeas() {
      setLoading(true);
      try {
        const res = await api.beneficiaries.getRecommendations(beneficiaryId);
        if (res.success && res.data?.self_employment_ideas) {
          setIdeas(res.data.self_employment_ideas);
        }
      } catch (err) {
        console.error('Self-employment ideas error', err);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, [beneficiaryId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('selfEmpPage.title')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          {t('selfEmpPage.subtitle')}
        </p>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-accent-800 bg-accent/20 px-3 py-1 rounded-full">
                  {idea.sector}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-dark mt-2">{idea.title}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                  {idea.match_score || 94}% {t('selfEmpPage.viabilityScore')}
                </span>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-ivory border border-soft-border space-y-1">
                <span className="text-[11px] text-muted block font-bold uppercase tracking-wider">{t('selfEmpPage.startupInvestment')}</span>
                <span className="text-base sm:text-lg font-black text-dark">{idea.estimated_investment}</span>
                <span className="text-xs text-muted block">Covered via {idea.linked_scheme_name}</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[11px] text-primary block font-bold uppercase tracking-wider">{t('selfEmpPage.monthlyRevenue')}</span>
                <span className="text-base sm:text-lg font-black text-primary">{idea.potential_monthly_income}</span>
                <span className="text-xs text-secondary font-bold block">{t('selfEmpPage.revenueMultiplier')}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {idea.description}
            </p>

            {/* Tools Needed Checklist */}
            {idea.tools_needed && idea.tools_needed.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-dark block">
                  {t('selfEmpPage.essentialEquipment')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {idea.tools_needed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-ivory text-dark font-medium px-3 py-1 rounded-lg border border-soft-border flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Execution Roadmap Summary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ivory border border-soft-border space-y-2">
              <span className="text-xs font-bold text-dark flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-secondary" />
                {t('selfEmpPage.launchTimeline')}
              </span>
              <p className="text-xs text-muted leading-relaxed">
                {idea.roadmap_summary}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-soft-border/70">
              <span className="text-xs text-muted">
                {t('selfEmpPage.financingPartner')} <span className="font-bold text-dark">{idea.linked_scheme_name}</span>
              </span>
              <button
                onClick={() => onNavigate('schemes')}
                className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-card"
              >
                <span>{t('selfEmpPage.applyLoanBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
