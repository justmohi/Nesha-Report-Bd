import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  onBack?: () => void;
  onNavigateLogin?: () => void;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  onBack,
  onNavigateLogin,
}) => {
  const { role, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-100">
          {language === 'bn' ? 'অননুমোদিত প্রবেশাধিকার' : 'Restricted Access'}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          {language === 'bn'
            ? 'এই সংরক্ষিত অংশটি কেবল সংশ্লিষ্ট থানার দায়িত্বপ্রাপ্ত পুলিশ কর্মকর্তা বা সুপার অ্যাডমিনের জন্য বরাদ্দকৃত।'
            : 'This protected law-enforcement section requires an authorized officer or Super Admin account.'}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
            </button>
          )}

          {onNavigateLogin && (
            <button
              onClick={onNavigateLogin}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
            >
              <LogIn className="w-4 h-4" />
              {language === 'bn' ? 'লগইন করুন' : 'Login'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
export default RoleGuard;
