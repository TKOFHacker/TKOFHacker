import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

export const SkillAnalyticsAdminPage: React.FC = () => {
  const skillGaps = [
    { trade: 'Certified Electrician (Level 4)', demand: 420, currentCertified: 180, deficit: 240, urgency: 'High' },
    { trade: 'Solar PV Rooftop Installer', demand: 280, currentCertified: 95, deficit: 185, urgency: 'Critical' },
    { trade: 'Agricultural Pump Motor Technician', demand: 310, currentCertified: 210, deficit: 100, urgency: 'Medium' },
    { trade: 'Industrial Electric Wireman', demand: 250, currentCertified: 160, deficit: 90, urgency: 'Medium' },
    { trade: 'Electronics Circuit Repairer', demand: 180, currentCertified: 120, deficit: 60, urgency: 'Low' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">District Skill Deficit & Demand Analytics</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Algorithmic supply-demand matching indicating where district training centers should open new batches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Largest Deficit Sector</span>
          <div className="text-xl font-extrabold text-primary">Solar & Renewable PV</div>
          <span className="text-xs text-secondary font-medium">66% shortage in Thanjavur district</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Highest Transition Potential</span>
          <div className="text-xl font-extrabold text-secondary">Farmer → Certified Electrician</div>
          <span className="text-xs text-primary font-bold">35% average skill gap easily bridged in 3 months</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-soft-border shadow-card space-y-1">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">PMEGP Capital Allocation</span>
          <div className="text-xl font-extrabold text-dark">₹4.2 Crores Allocated</div>
          <span className="text-xs text-muted">Available for rural micro-enterprises</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-soft-border overflow-hidden shadow-card">
        <div className="p-5 border-b border-soft-border font-extrabold text-sm sm:text-base text-dark bg-ivory/50">
          Thanjavur & Central Delta Skill Gap Matrix
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-soft-border text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Trade / Vocational Sector</th>
                <th className="p-4">Annual Employer Demand</th>
                <th className="p-4">Currently Certified</th>
                <th className="p-4">Talent Deficit</th>
                <th className="p-4">Priority Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-border text-dark">
              {skillGaps.map((item, idx) => (
                <tr key={idx} className="hover:bg-ivory/40 transition">
                  <td className="p-4 font-bold text-dark">{item.trade}</td>
                  <td className="p-4 font-mono font-medium">{item.demand} positions</td>
                  <td className="p-4 font-mono font-bold text-secondary">{item.currentCertified} citizens</td>
                  <td className="p-4 font-mono font-extrabold text-red-600">-{item.deficit}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                      item.urgency === 'Critical'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : (item.urgency === 'High' ? 'bg-accent/20 text-accent-800 border border-accent/40' : 'bg-ivory text-muted border border-soft-border')
                    }`}>
                      {item.urgency} Urgency Batch
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
