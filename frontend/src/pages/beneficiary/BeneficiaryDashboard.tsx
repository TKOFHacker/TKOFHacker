import React, { useEffect, useState } from 'react';
import { 
  Mic, Award, Compass, Briefcase, GraduationCap, Building, 
  ArrowRight, CheckCircle2, ChevronRight, TrendingUp, Sparkles, AlertCircle, Phone
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { BeneficiaryProfile, LivelihoodRoadmap } from '../../types';

export const BeneficiaryDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<BeneficiaryProfile | null>(null);
  const [roadmap, setRoadmap] = useState<LivelihoodRoadmap | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [profRes, roadRes, recRes] = await Promise.all([
          api.beneficiaries.get(beneficiaryId),
          api.roadmap.get(beneficiaryId),
          api.beneficiaries.getRecommendations(beneficiaryId)
        ]);
        if (profRes.success && profRes.data) setProfile(profRes.data);
        if (roadRes.success && roadRes.data) setRoadmap(roadRes.data);
        if (recRes.success && recRes.data) setRecommendations(recRes.data);
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [beneficiaryId]);

  const displayName = profile?.name || user?.full_name || 'Karthik M.';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-primary to-[#184e45] text-white p-6 sm:p-8 rounded-3xl shadow-elevated relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/30 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>{t('beneficiary.citizenProfile')} • {profile?.location?.district || user?.district || 'Thanjavur'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('beneficiary.welcome')}, {displayName}!
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
            {t('beneficiary.currentOccupation')}: <span className="font-semibold text-white">{profile?.occupation || 'Farmer'}</span> (12th) → {t('beneficiary.targetCareer')}:{' '}
            <span className="font-bold text-accent">{profile?.target_career || 'Electrician'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('voice-assistant')}
            className="px-6 py-3.5 bg-accent hover:bg-accent-500 text-dark font-extrabold rounded-xl shadow-glow-accent flex items-center justify-center gap-2 text-sm transition-all duration-200 active:scale-95 w-full sm:w-auto"
          >
            <Mic className="w-4 h-4" />
            <span>{t('nav.talkToLivora') || t('nav.voiceAssistant')}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => onNavigate('skills')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-soft-border shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('beneficiary.verifiedSkills')}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark">
              {profile?.skills?.length || 3} {language === 'ta' ? 'திறன்கள்' : language === 'hi' ? 'कौशल' : 'Skills'}
            </div>
            <div className="text-xs font-semibold text-secondary mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Basic Electrical (87%)
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('skill-gap')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-soft-border shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('beneficiary.gapScore')}</span>
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark">
              35% {language === 'ta' ? 'இடைவெளி' : language === 'hi' ? 'अंतराल' : 'Gap'}
            </div>
            <div className="text-xs font-semibold text-primary mt-1">
              {language === 'ta' ? 'தயார்நிலை: இடைநிலை' : language === 'hi' ? 'तैयारी: मध्यम स्तर' : 'Readiness: Intermediate'}
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('roadmap')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-soft-border shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('beneficiary.yourProgress')}</span>
            <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent-800 flex items-center justify-center group-hover:bg-accent group-hover:text-dark transition">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark">
              {roadmap?.completed_steps || 1} / {roadmap?.total_steps || 6}
            </div>
            <div className="text-xs font-semibold text-accent-700 mt-1">
              {t('roadmap.step')} 1 {t('beneficiary.stepDone')}
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('schemes')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-soft-border shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('nav.schemes')}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark">Up to 35%</div>
            <div className="text-xs font-semibold text-secondary mt-1">
              {language === 'ta' ? 'PMEGP & முத்ரா தகுதி' : language === 'hi' ? 'PMEGP व मुद्रा पात्र' : 'PMEGP & Mudra Eligible'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Roadmap Quickview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
              <Compass className="w-5 h-5 text-secondary" />
              {t('roadmap.title')}
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              {roadmap?.goal_title || 'Certified Electrician & Self-Employed Contractor'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs sm:text-sm text-secondary font-bold hover:text-primary flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>{t('beneficiary.viewPathway')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>{t('beneficiary.overallCompletion')}</span>
            <span className="text-primary font-bold">{roadmap?.progress_percentage || 17}%</span>
          </div>
          <div className="w-full bg-ivory border border-soft-border rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${roadmap?.progress_percentage || 17}%` }}
            />
          </div>
        </div>

        {/* Step Preview Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {roadmap?.steps?.slice(0, 3).map((step, idx) => (
            <div 
              key={step.id || idx}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 transition ${
                step.is_completed 
                  ? 'bg-secondary/5 border-secondary/20 text-dark' 
                  : 'bg-ivory border-soft-border text-muted'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className={step.is_completed ? 'text-secondary font-bold' : 'text-muted'}>
                  {t('roadmap.step')} {step.step_order}
                </span>
                {step.is_completed ? (
                  <span className="text-[11px] text-secondary font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('beneficiary.stepDone')}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted">{step.expected_duration}</span>
                )}
              </div>
              <div className="font-bold text-dark text-sm line-clamp-1">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Top Recommended Opportunities Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommended Job */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-5 flex flex-col justify-between hover:shadow-card-hover transition-all">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {t('beneficiary.topJobMatch')}
              </span>
              <span className="text-xs font-bold text-secondary">95% {t('jobsPage.matchScore')}</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-dark">Junior Electrician / Wireman</h3>
            <p className="text-xs text-muted">Kavitha Energy Solutions • Thanjavur</p>
            <div className="text-sm font-bold text-primary">₹16,000 - ₹22,000 / month</div>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              Residential wiring and solar connectivity. Practical candidates with informal hands-on knowledge encouraged.
            </p>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="w-full py-2.5 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition flex items-center justify-center gap-1.5"
          >
            <span>{t('beneficiary.viewJobDetails')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>

        {/* Recommended Training */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-5 flex flex-col justify-between hover:shadow-card-hover transition-all">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                {t('beneficiary.freeGovtTraining')}
              </span>
              <span className="text-xs font-bold text-secondary">96% {t('trainingPage.skillMatch')}</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-dark">NSDC Level 4 Electrician</h3>
            <p className="text-xs text-muted">PMKK Skill Centre • Medical College Rd, Thanjavur</p>
            <div className="text-sm font-bold text-secondary">Free + ₹1,500/mo Stipend</div>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              3-Month practical certification bridging your missing competencies in safety wiring and circuit diagnostics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('training')}
            className="w-full py-2.5 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition flex items-center justify-center gap-1.5"
          >
            <span>{t('beneficiary.enrollInCourse')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>

        {/* Recommended Government Scheme */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-5 flex flex-col justify-between hover:shadow-card-hover transition-all">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/20 text-accent-800">
                {t('beneficiary.capitalSubsidy')}
              </span>
              <span className="text-xs font-bold text-primary">94% {t('schemesPage.eligibilityScore')}</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-dark">PMEGP Scheme (Rural)</h3>
            <p className="text-xs text-muted">Ministry of MSME</p>
            <div className="text-sm font-bold text-dark">Up to 35% Capital Subsidy</div>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              Get bank project loan with 35% government grant for purchasing electrician toolkits and opening a service center.
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="w-full py-2.5 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition flex items-center justify-center gap-1.5"
          >
            <span>{t('beneficiary.checkEligibility')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
};
