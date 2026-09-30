import React, { useEffect, useState } from 'react';
import { 
  Users, Award, Phone, Briefcase, GraduationCap, Building, 
  TrendingUp, BarChart3, PieChart, Shield, MapPin, ArrowRight, Activity 
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { AdminDashboardData } from '../../types';

export const AdminDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.admin.getDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin telemetry', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-dark">{t('admin.dashboardTitle')}</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {t('admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-calls')}
            className="px-4 py-2.5 bg-white hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-secondary" /> Voice Call Logs
          </button>
          <button
            onClick={() => onNavigate('admin-beneficiaries')}
            className="px-4 py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-card"
          >
            <Users className="w-3.5 h-3.5" /> Beneficiary Directory
          </button>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.totalBeneficiaries')}</span>
          <div className="text-2xl font-black text-dark">
            {data?.cards.total_beneficiaries || 670}
          </div>
          <div className="text-[10px] font-bold text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% this week
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.completedAssessments')}</span>
          <div className="text-2xl font-black text-primary">
            {data?.cards.completed_assessments || 635}
          </div>
          <div className="text-[10px] text-muted font-medium">95% conversion</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.voiceCalls')}</span>
          <div className="text-2xl font-black text-secondary">
            {data?.cards.voice_calls_count || 785}
          </div>
          <div className="text-[10px] text-secondary font-medium">Telephony Audio</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.jobMatches')}</span>
          <div className="text-2xl font-black text-dark">
            {data?.cards.job_matches_count || 438}
          </div>
          <div className="text-[10px] text-muted font-medium">Local vacancies</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.trainingMatches')}</span>
          <div className="text-2xl font-black text-primary">
            {data?.cards.training_matches_count || 404}
          </div>
          <div className="text-[10px] text-primary font-medium">PMKVY / NSDC</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">{t('admin.schemeMatches')}</span>
          <div className="text-2xl font-black text-accent-800">
            {data?.cards.scheme_matches_count || 853}
          </div>
          <div className="text-[10px] text-accent-700 font-medium">PMEGP / Mudra</div>
        </div>
      </div>

      {/* Visual Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Distribution Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {t('admin.districtDistribution')}
            </h3>
            <span className="text-xs text-muted font-medium">Delta District Region</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {data?.district_distribution?.map((item) => (
              <div key={item.district} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark">{item.district}</span>
                  <span className="text-muted font-mono">{item.count} citizens ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-ivory border border-soft-border rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Distribution Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-secondary" /> {t('admin.educationDistribution')}
            </h3>
            <span className="text-xs text-muted font-medium">Baseline Qualifications</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {data?.education_distribution?.map((item) => (
              <div key={item.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark">{item.level}</span>
                  <span className="text-muted font-mono">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-ivory border border-soft-border rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Skills Velocity & Telephony Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Popularity */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-secondary" /> {t('admin.skillsInDemand')}
          </h3>
          <div className="space-y-2.5">
            {data?.skills_distribution?.map((item) => (
              <div key={item.skill} className="flex items-center justify-between p-3 rounded-xl bg-ivory border border-soft-border text-xs">
                <span className="font-bold text-dark">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted">{item.count}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {item.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Status Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" /> Citizen Employment Status
          </h3>
          <div className="space-y-3">
            {data?.employment_status?.map((item) => (
              <div key={item.status} className="p-3 rounded-xl bg-ivory border border-soft-border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark">{item.status}</span>
                  <span className="font-mono text-dark font-extrabold">{item.count}</span>
                </div>
                <div className="w-full bg-soft-border rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: item.color || '#123C35',
                      width: `${Math.round((item.count / 670) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice & IVR Channel Telemetry */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
            <Phone className="w-4 h-4 text-secondary" /> {t('admin.callTelemetry')}
          </h3>
          <div className="space-y-3">
            {data?.voice_call_stats?.map((stat) => (
              <div key={stat.channel} className="p-3.5 rounded-xl bg-ivory border border-soft-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-dark">
                  <span>{stat.channel}</span>
                  <span className="text-secondary font-extrabold">{stat.calls} calls</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>Completed: {stat.completed}</span>
                  <span>Avg Duration: {stat.avg_duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
