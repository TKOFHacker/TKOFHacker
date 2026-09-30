import React, { useEffect, useState } from 'react';
import { 
  Building, Award, CheckCircle2, FileText, ExternalLink, 
  DollarSign, ShieldCheck 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { GovernmentScheme } from '../../types';

export const GovernmentSchemesPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      try {
        const res = await api.schemes.eligible(beneficiaryId);
        if (res.success && res.data) {
          setSchemes(res.data);
        }
      } catch (err) {
        console.error('Schemes fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, [beneficiaryId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('schemesPage.title') || t('nav.schemes')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          {t('schemesPage.subtitle')}
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-6">
        {schemes.map((s) => (
          <div
            key={s.id}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {s.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-dark mt-2">{s.scheme_name}</h3>
                <div className="text-xs text-muted font-medium">{s.ministry}</div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                  {s.match_score || 95}% {t('schemesPage.eligibilityScore')}
                </span>
              </div>
            </div>

            {/* Subsidy Highlight Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-accent/15 border border-accent/30 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-accent/30 text-accent-900 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 font-black" />
              </div>
              <div>
                <span className="text-xs text-accent-900 font-bold block uppercase tracking-wider">
                  {t('schemesPage.subsidyHighlight')}
                </span>
                <span className="text-base font-extrabold text-dark">{s.subsidy_amount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-ivory p-4 rounded-2xl border border-soft-border space-y-1">
                <span className="text-dark font-bold block">{t('schemesPage.criteriaTitle')}</span>
                <p className="text-muted leading-relaxed">{s.eligibility_criteria}</p>
              </div>

              <div className="bg-ivory p-4 rounded-2xl border border-soft-border space-y-1">
                <span className="text-dark font-bold block">{t('schemesPage.benefitsTitle')}</span>
                <p className="text-muted leading-relaxed">{s.benefits}</p>
              </div>
            </div>

            {/* Document Checklist */}
            {s.required_documents && s.required_documents.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-dark block mb-2">
                  {t('schemesPage.documentsTitle')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {s.required_documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-ivory text-dark font-medium px-3 py-1 rounded-lg border border-soft-border flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portal Action Link */}
            <div className="pt-3 border-t border-soft-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-secondary" /> {t('schemesPage.verifiedScheme')}
              </span>
              <a
                href={s.application_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-card"
              >
                <span>{t('schemesPage.portalBtn')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
