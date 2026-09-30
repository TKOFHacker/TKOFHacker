import React, { useEffect, useState } from 'react';
import { Users, Search, MapPin, CheckCircle2, Shield, Eye, Filter } from 'lucide-react';
import { api } from '../../services/api';

export const BeneficiariesAdminPage: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.admin.getBeneficiaries();
        if (res.success && res.data) {
          setBeneficiaries(res.data);
        }
      } catch (err) {
        console.error('Beneficiaries fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.target_career.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soft-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-dark">Registered Beneficiaries Directory</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Roster of rural talent enrolled via IVR telephony and web voice assessment.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search citizen, district, skill..."
            className="w-full bg-white border border-soft-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-dark placeholder:text-muted/60 focus:outline-none focus:border-secondary shadow-sm transition"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-soft-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-soft-border text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Citizen Name</th>
                <th className="p-4">Phone (Masked)</th>
                <th className="p-4">District / State</th>
                <th className="p-4">Education</th>
                <th className="p-4">Current Trade</th>
                <th className="p-4">Target Career</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-border text-dark">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-ivory/50 transition">
                  <td className="p-4 font-extrabold text-dark flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {b.name.charAt(0)}
                    </div>
                    <span>{b.name}</span>
                  </td>
                  <td className="p-4 font-mono text-muted">{b.phone_masked}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 font-medium text-dark">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      {b.district}, {b.state}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{b.education}</td>
                  <td className="p-4 text-muted">{b.occupation}</td>
                  <td className="p-4 font-bold text-secondary">{b.target_career}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary">
                      <CheckCircle2 className="w-3 h-3" /> Profile Active
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
