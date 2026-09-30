import React from 'react';
import { FileText, CheckCircle2, Clock, Building, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ApplicationsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const applications = [
    {
      id: 1,
      type: 'Job Application',
      title: 'Junior Electrician / Wireman',
      organization: 'Kavitha Energy Solutions, Thanjavur',
      status: 'Under Review',
      statusColor: 'text-accent-800 bg-accent/20 border-accent/30',
      date: '2026-09-27',
      matchScore: '95%'
    },
    {
      id: 2,
      type: 'Training Enrollment',
      title: 'NSDC Level 4 Domestic Electrician',
      organization: 'Pradhan Mantri Kaushal Kendra (PMKK) Thanjavur',
      status: 'Confirmed (Batch 12)',
      statusColor: 'text-secondary bg-secondary/10 border-secondary/20',
      date: '2026-09-25',
      matchScore: '96%'
    },
    {
      id: 3,
      type: 'Government Scheme Intent',
      title: "Prime Minister's Employment Generation Programme (PMEGP)",
      organization: 'District Industries Centre (DIC) Thanjavur',
      status: 'Project Report Prepared',
      statusColor: 'text-primary bg-primary/10 border-primary/20',
      date: '2026-09-28',
      matchScore: '35% Rural Subsidy'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('nav.applications')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Track the live review status of your job submissions, training enrollments, and subsidy claims.
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {app.type}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-dark mt-0.5">{app.title}</h3>
                <div className="text-xs text-secondary font-bold">{app.organization}</div>
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${app.statusColor}`}>
                  {app.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-soft-border/70">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Applied on {app.date}
              </span>
              <span className="font-bold text-dark">
                Evaluation Score: {app.matchScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
