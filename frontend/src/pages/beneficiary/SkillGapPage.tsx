import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, 
  GraduationCap, Briefcase, Award, RefreshCw, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SkillGapData } from '../../types';

export const SkillGapPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [gapData, setGapData] = useState<SkillGapData | null>(null);
  const [selectedCareer, setSelectedCareer] = useState('Electrician');
  const [loading, setLoading] = useState(true);

  const careerOptions = [
    { key: 'electrician', title: 'Electrician', sector: 'Electrical Services' },
    { key: 'solarTechnician', title: 'Solar Technician', sector: 'Renewable Energy' },
    { key: 'agriTechnician', title: 'Agricultural Technician', sector: 'Agro-Mechanization' }
  ];

  const fetchGap = async (career: string) => {
    setLoading(true);
    try {
      const res = await api.ai.analyzeGap(career, ['Basic Electrical', 'Farming']);
      if (res.success && res.data) {
        setGapData(res.data);
      }
    } catch (err) {
      console.error('Gap analysis error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGap(selectedCareer);
  }, [selectedCareer]);

  const currentRole = careerOptions.find(c => c.title === selectedCareer) || careerOptions[0];
  const localizedRoleTitle = t(`skillGapPage.roles.${currentRole.key}`) || `${currentRole.title} (${currentRole.sector})`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-dark">{t('skillGapPage.title') || t('nav.skillGap')}</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            {t('skillGapPage.subtitle')}
          </p>
        </div>

        {/* Career Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted font-bold">{t('skillGapPage.targetRole')}</span>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="bg-white border border-soft-border text-dark rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-secondary shadow-sm transition"
          >
            {careerOptions.map((c) => (
              <option key={c.title} value={c.title}>
                {t(`skillGapPage.roles.${c.key}`) || `${c.title} (${c.sector})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Display Flow: Current Skills → Skill Gap → Required Training → Career */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-soft-border shadow-card space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
            {t('skillGapPage.bridgePathwayTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-center">
          {/* Box 1: Current Skills */}
          <div className="bg-ivory p-5 rounded-2xl border border-soft-border space-y-2">
            <span className="text-[11px] font-bold text-muted block uppercase tracking-wider">
              {t('skillGapPage.currentSkills')}
            </span>
            <div className="text-sm font-extrabold text-dark">
              {gapData?.current_skills?.join(', ') || 'Basic Electrical'}
            </div>
            <div className="text-[10px] text-muted font-medium">
              {t('skillGapPage.currentSkillsSub')}
            </div>
          </div>

          {/* Box 2: Skill Gap */}
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-2">
            <span className="text-[11px] font-bold text-primary block uppercase tracking-wider">
              {t('skillGapPage.skillGap')} ({gapData?.gap_score || 35}%)
            </span>
            <div className="text-xs font-bold text-dark line-clamp-2">
              {gapData?.missing_skills?.slice(0, 2).join(', ')}
            </div>
            <div className="text-[10px] text-secondary font-semibold">
              {t('skillGapPage.skillGapSub')}
            </div>
          </div>

          {/* Box 3: Required Training */}
          <div className="bg-accent/10 p-5 rounded-2xl border border-accent/30 space-y-2">
            <span className="text-[11px] font-bold text-accent-800 block uppercase tracking-wider">
              {t('skillGapPage.requiredTraining')}
            </span>
            <div className="text-xs font-bold text-dark line-clamp-2">
              NSDC Level 4 Electrician
            </div>
            <div className="text-[10px] text-accent-700 font-semibold">
              {t('skillGapPage.trainingCenter')}
            </div>
          </div>

          {/* Box 4: Career */}
          <div className="bg-primary p-5 rounded-2xl text-white space-y-2 shadow-card">
            <span className="text-[11px] font-bold text-accent block uppercase tracking-wider">
              {t('skillGapPage.targetLivelihood')}
            </span>
            <div className="text-sm font-black text-white">
              {localizedRoleTitle}
            </div>
            <div className="text-[10px] text-white/80 font-medium">
              {t('skillGapPage.salaryRange')}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Verified Skills */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-dark flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              {t('skillGapPage.verifiedCurrentSkills')}
            </h3>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
              {t('skillGapPage.readyBadge')}
            </span>
          </div>

          <div className="space-y-2.5">
            {gapData?.current_skills?.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-ivory border border-soft-border">
                <span className="text-sm text-dark font-semibold">{skill}</span>
                <span className="text-xs text-secondary font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('skillGapPage.metBadge')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Competencies to Bridge */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-dark flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent-700" />
              {t('skillGapPage.missingCompetencies')}
            </h3>
            <span className="text-xs font-bold text-accent-800 bg-accent/20 px-2.5 py-0.5 rounded-full">
              {t('skillGapPage.toAcquireBadge')}
            </span>
          </div>

          <div className="space-y-2.5">
            {gapData?.missing_skills?.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-ivory border border-soft-border">
                <span className="text-sm text-dark font-medium">{skill}</span>
                <span className="text-xs text-accent-800 font-bold bg-accent/20 px-2 py-0.5 rounded">
                  {t('skillGapPage.gapItemBadge')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Bridge Trainings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-5">
        <div>
          <h3 className="font-extrabold text-lg text-dark flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {t('skillGapPage.recommendedCourses')}
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {t('skillGapPage.recommendedCoursesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gapData?.required_training?.map((tr) => (
            <div key={tr.id} className="p-5 rounded-2xl bg-ivory border border-soft-border flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-extrabold text-base text-dark">{tr.title}</h4>
                <p className="text-xs text-muted mt-1">{tr.provider}</p>
                <div className="text-xs text-secondary mt-2 font-bold">
                  {t('skillGapPage.duration')} {tr.duration}
                </div>
              </div>
              <button
                onClick={() => onNavigate('training')}
                className="w-full py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl text-xs font-bold transition shadow-card"
              >
                {t('skillGapPage.enrollFreeBtn')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
