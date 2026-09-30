import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

export const NotificationsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.notifications.list();
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error('Notifications error', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    await api.notifications.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-soft-border pb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-dark">{t('nav.notifications')}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Real-time updates regarding scheme subsidy releases, training batch alerts, and job shortlists.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white p-5 rounded-2xl border transition flex items-start justify-between gap-4 shadow-card ${
              n.is_read ? 'border-soft-border opacity-70' : 'border-secondary/40 bg-secondary/5'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-dark">{n.title}</h4>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-muted/70 mt-2 block font-medium">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {!n.is_read && (
              <button
                onClick={() => markAsRead(n.id)}
                className="px-3 py-1.5 bg-ivory hover:bg-soft-border text-dark rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 border border-soft-border"
              >
                <Check className="w-3.5 h-3.5 text-secondary" /> Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
