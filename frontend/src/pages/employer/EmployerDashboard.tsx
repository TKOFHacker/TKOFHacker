import React, { useState } from 'react';
import { 
  Building2, Briefcase, GraduationCap, Users, Plus, 
  CheckCircle2, Clock, Send, Sparkles, MapPin 
} from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'post'>('jobs');
  const [newJob, setNewJob] = useState({
    title: '',
    sector: 'Electrical',
    vacancies: 2,
    salary: '₹18,000 - ₹24,000 / month',
    district: 'Thanjavur'
  });
  const [jobPosted, setJobPosted] = useState(false);

  const candidates = [
    {
      id: 1,
      name: 'Karthik S.',
      location: 'Thanjavur (Kumbakonam)',
      education: '12th Standard',
      verifiedSkills: ['Basic Electrical (87%)', 'Farming (94%)'],
      targetCareer: 'Electrician',
      matchScore: '95%',
      status: 'Assessment Verified',
      date: '2026-09-28'
    },
    {
      id: 2,
      name: 'Murugan S.',
      location: 'Thanjavur (Papanasam)',
      education: 'ITI Electrician',
      verifiedSkills: ['Domestic Wiring (82%)', 'Plumbing (70%)'],
      targetCareer: 'Solar Technician',
      matchScore: '91%',
      status: 'Interview Scheduled',
      date: '2026-09-27'
    }
  ];

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setJobPosted(true);
    setTimeout(() => {
      setJobPosted(false);
      setActiveTab('jobs');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-accent-800">
            <Building2 className="w-4 h-4 text-accent" />
            <span>Employer & Skill Provider Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mt-1">
            Kavitha Energy & Electrical Solutions
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Recruiting verified technical talent across Thanjavur & Central Region.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('post')}
          className="px-5 py-2.5 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-card"
        >
          <Plus className="w-4 h-4" /> Post New Job Vacancy
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-soft-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'jobs' ? 'bg-primary text-white' : 'text-muted hover:text-dark'
          }`}
        >
          Active Job Listings (2)
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'candidates' ? 'bg-primary text-white' : 'text-muted hover:text-dark'
          }`}
        >
          Matched Candidates (2)
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'post' ? 'bg-primary text-white' : 'text-muted hover:text-dark'
          }`}
        >
          Post Vacancy
        </button>
      </div>

      {/* Tab Content: Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-soft-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                Active • 4 Vacancies
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-dark">Junior Electrician / Wireman</h3>
              <p className="text-xs text-muted">
                Thanjavur & Kumbakonam • ₹16,000 - ₹22,000 / month
              </p>
              <div className="text-xs text-primary font-bold">
                12 AI-Matched Candidates Available in Database
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="px-4 py-2 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition"
            >
              Review Applicants
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-soft-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                Active • 3 Vacancies
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-dark">Solar Panel Installation Technician</h3>
              <p className="text-xs text-muted">
                Thanjavur Rural • ₹18,000 - ₹25,000 / month
              </p>
              <div className="text-xs text-primary font-bold">
                6 Candidates Enrolled in Prerequisite Suryamitra Training
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="px-4 py-2 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold border border-soft-border transition"
            >
              Review Applicants
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Candidates */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-soft-border shadow-card hover:shadow-card-hover transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm border border-primary/20">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-dark">{c.name}</h3>
                    <div className="text-xs text-muted flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-secondary" /> {c.location} • {c.education}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                    {c.matchScore} Competency Match
                  </span>
                  <span className="text-xs text-muted font-medium">{c.status}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-dark font-bold self-center">Verified Competencies:</span>
                {c.verifiedSkills.map((s, idx) => (
                  <span key={idx} className="bg-ivory border border-soft-border text-primary font-semibold px-2.5 py-1 rounded-md">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-soft-border text-xs">
                <span className="text-muted font-medium">Target Role: {c.targetCareer}</span>
                <button className="px-4 py-2 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-xs transition shadow-sm">
                  Shortlist & Invite for Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Post New Vacancy Form */}
      {activeTab === 'post' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-soft-border shadow-card space-y-4">
          <h3 className="font-extrabold text-base sm:text-lg text-dark">Post New Apprenticeship or Technician Vacancy</h3>
          <p className="text-xs sm:text-sm text-muted">
            Our recommendation engine will automatically notify and match eligible rural candidates within 25km.
          </p>

          {jobPosted ? (
            <div className="p-8 text-center text-secondary space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto" />
              <h4 className="font-extrabold text-dark text-lg">Job Successfully Published!</h4>
              <p className="text-xs text-muted">Matched with 14 candidates in Thanjavur district.</p>
            </div>
          ) : (
            <form onSubmit={handlePostJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-dark font-bold block mb-1.5">Job Designation</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Solar Field Maintenance Technician"
                    className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark focus:outline-none focus:border-secondary focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-dark font-bold block mb-1.5">Sector</label>
                  <select
                    value={newJob.sector}
                    onChange={(e) => setNewJob({ ...newJob, sector: e.target.value })}
                    className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark focus:outline-none focus:border-secondary focus:bg-white transition"
                  >
                    <option value="Electrical">Electrical & Electronics</option>
                    <option value="Renewable">Renewable Energy / Solar</option>
                    <option value="Agro">Agro-Mechanization</option>
                    <option value="Automotive">Automotive & Motor Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-dark font-bold block mb-1.5">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark focus:outline-none focus:border-secondary focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-dark font-bold block mb-1.5">District / Work Location</label>
                  <input
                    type="text"
                    value={newJob.district}
                    onChange={(e) => setNewJob({ ...newJob, district: e.target.value })}
                    className="w-full bg-ivory border border-soft-border rounded-xl px-3.5 py-2.5 text-dark focus:outline-none focus:border-secondary focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-900 text-white font-bold rounded-xl text-xs transition shadow-card"
              >
                Publish Vacancy
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
