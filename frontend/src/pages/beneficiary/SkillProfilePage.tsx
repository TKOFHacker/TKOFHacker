import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Plus, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BeneficiarySkill } from '../../types';

export const SkillProfilePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [skills, setSkills] = useState<BeneficiarySkill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [loading, setLoading] = useState(true);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadSkills() {
      setLoading(true);
      try {
        const res = await api.beneficiaries.getSkills(beneficiaryId);
        if (res.success && res.data) {
          setSkills(res.data);
        }
      } catch (err) {
        console.error('Failed to load skills', err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, [beneficiaryId]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const aiRes = await api.ai.analyzeSkills({
        beneficiary_id: beneficiaryId,
        extracted_data: { skills: [newSkillName.trim()] }
      });
      if (aiRes.success && aiRes.data?.mapped_skills?.[0]) {
        const mapped = aiRes.data.mapped_skills[0];
        setSkills((prev) => [
          ...prev,
          {
            id: Date.now(),
            skill_name: mapped.skill_name,
            skill_category: mapped.skill_category,
            skill_level: mapped.skill_level,
            years_experience: mapped.years_experience,
            ai_confidence: mapped.ai_confidence,
            verified_by_assessment: true
          }
        ]);
      }
      setNewSkillName('');
    } catch (err) {
      console.error('Add skill error', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-dark">{t('skillsPage.title')}</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {t('skillsPage.subtitle')}
          </p>
        </div>

        <button
          onClick={() => onNavigate('skill-gap')}
          className="px-5 py-2.5 bg-primary hover:bg-primary-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-card"
        >
          <span>{t('skillsPage.runDiagnosticBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {skill.skill_category}
                </span>
                <h3 className="text-lg font-extrabold text-dark mt-2">{skill.skill_name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-dark px-2.5 py-1 rounded-lg bg-ivory border border-soft-border">
                  {t('skillsPage.level')} {skill.skill_level}
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-medium">{t('skillsPage.competencyConfidence')}</span>
                <span className="font-bold text-secondary">
                  {Math.round(skill.ai_confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-ivory border border-soft-border rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(skill.ai_confidence * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-soft-border/70">
              <span className="font-medium">{t('skillsPage.experience')} ~{skill.years_experience} Years</span>
              <span className="flex items-center gap-1 text-secondary font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('skillsPage.voiceVerified')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Skill Quick Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-dark flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          {t('skillsPage.addSkillTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          {t('skillsPage.addSkillSub')}
        </p>

        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder={t('skillsPage.addSkillPlaceholder')}
            className="flex-1 bg-ivory border border-soft-border rounded-xl px-4 py-3 text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary focus:bg-white transition"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-secondary hover:bg-secondary-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-card"
          >
            <Plus className="w-4 h-4" /> {t('skillsPage.addSkillBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};
