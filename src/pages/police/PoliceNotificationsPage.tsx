import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle2, ArrowRight, Clock, Shield } from 'lucide-react';

interface PoliceNotificationsPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const PoliceNotificationsPage: React.FC<PoliceNotificationsPageProps> = ({
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { policeUser } = useAuth();
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>{policeUser?.thanaNameBn || 'থানা বার্তা'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'bn' ? 'থানা নোটিফিকেশন ও অ্যালার্ট' : 'Thana Station Notifications'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'bn'
            ? 'আপনার থানায় নতুন রিপোর্ট জমা হলে তাৎক্ষণিক নোটিফিকেশন প্রদান করা হয়।'
            : 'Automated dispatch notifications when reports are routed to your Thana.'}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">
            {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'নতুন কোনো ঘটনা রিপোর্ট হলে এখানে বার্তা আসবে।' : 'New incidents will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-slate-900 border-blue-500/40 text-slate-200 shadow-lg'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${notif.isRead ? 'bg-slate-600' : 'bg-blue-400'}`} />
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-4">
                  {notif.message}
                </p>
                <div className="text-[11px] text-slate-500 pl-4 pt-1 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
                {notif.reportId && (
                  <button
                    onClick={() => onNavigate('police-report-detail', notif.reportId)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'রিপোর্ট দেখুন' : 'View'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PoliceNotificationsPage;
