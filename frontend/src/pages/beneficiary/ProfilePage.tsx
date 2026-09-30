import React, { useEffect, useState } from 'react';
import { User, Phone, MapPin, Briefcase, GraduationCap, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BeneficiaryProfile } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<BeneficiaryProfile | null>(null);
  const [form, setForm] = useState({
    education: '12th',
    occupation: 'Farmer',
    target_career: 'Electrician',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    years_experience: 3
  });
  const [saved, setSaved] = useState(false);

  const beneficiaryId = user?.beneficiary_id || 1;

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.beneficiaries.get(beneficiaryId);
        if (res.success && res.data) {
          setProfile(res.data);
          setForm({
            education: res.data.education || '12th',
            occupation: res.data.occupation || 'Farmer',
            target_career: res.data.target_career || 'Electrician',
            district: res.data.location?.district || 'Thanjavur',
            state: res.data.location?.state || 'Tamil Nadu',
            years_experience: res.data.years_experience || 3
          });
        }
      } catch (err) {
        console.error('Profile fetch error', err);
      }
    }
    loadProfile();
  }, [beneficiaryId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.beneficiaries.update(beneficiaryId, {
        education_level: form.education,
        current_occupation: form.occupation,
        target_career: form.target_career,
        district: form.district,
        state: form.state,
        years_experience: Number(form.years_experience)
      });
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Update profile error', err);
    }
  };

  const displayName = profile?.name || user?.full_name || 'Learner';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-dark">{t('nav.profile')}</h1>
            <p className="text-xs sm:text-sm text-muted">
              Vocational attributes synchronized across voice calls, telephone IVR, and your digital portfolio.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-soft-border shadow-card space-y-5 text-center">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-extrabold shadow-card">
            {displayName.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-dark">{displayName}</h3>
            <p className="text-xs text-secondary font-bold mt-0.5">{form.target_career} (Aspirant)</p>
          </div>

          <div className="space-y-2.5 text-xs text-muted text-left pt-3 border-t border-soft-border">
            <div className="flex items-center justify-between">
              <span className="font-medium">Masked Phone:</span>
              <span className="font-mono font-semibold text-dark">{profile?.phone_masked || '98765XXXX0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">District:</span>
              <span className="font-semibold text-dark">{form.district}, {form.state}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Primary Access:</span>
              <span className="text-primary font-bold">Voice / Phone / Web</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-ivory border border-soft-border text-left flex items-start gap-2 text-[11px] text-muted">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <span>Profile verified by Livora conversational intelligence engine.</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-5">
          <h3 className="font-extrabold text-base sm:text-lg text-dark">Vocational Parameters</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-dark font-semibold block mb-1.5">{t('beneficiary.level')} (Education)</label>
                <select
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                >
                  <option value="8th">8th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="12th">12th Standard</option>
                  <option value="ITI">ITI / Vocational</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Degree / Graduate</option>
                </select>
              </div>

              <div>
                <label className="text-dark font-semibold block mb-1.5">{t('beneficiary.currentOccupation')}</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-dark font-semibold block mb-1.5">{t('beneficiary.targetCareer')}</label>
                <input
                  type="text"
                  value={form.target_career}
                  onChange={(e) => setForm({ ...form, target_career: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-dark font-semibold block mb-1.5">{t('beneficiary.experience')} (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.years_experience}
                  onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-dark font-semibold block mb-1.5">{t('beneficiary.location')} (District)</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-dark font-semibold block mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark text-xs focus:outline-none focus:border-secondary focus:bg-white transition"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-soft-border">
              {saved ? (
                <span className="text-secondary font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-xs transition shadow-card flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
