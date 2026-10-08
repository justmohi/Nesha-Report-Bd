import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Building2, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { loginAsPublic, loginAsPolice, loginAsAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'PUBLIC' | 'POLICE' | 'ADMIN'>('POLICE');
  const [email, setEmail] = useState<string>('police.gulshan@police.gov.bd');
  const [password, setPassword] = useState<string>('police123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: 'PUBLIC' | 'POLICE' | 'ADMIN') => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'PUBLIC') {
      setEmail('citizen@example.com');
      setPassword('citizen123');
    } else if (tab === 'POLICE') {
      setEmail('police.gulshan@police.gov.bd');
      setPassword('police123');
    } else if (tab === 'ADMIN') {
      setEmail('admin@neshareportbd.gov.bd');
      setPassword('admin123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === 'PUBLIC') {
        await loginAsPublic(email, password);
        onNavigate('my-reports');
      } else if (activeTab === 'POLICE') {
        const success = await loginAsPolice(email, password);
        if (success) {
          onNavigate('police-dashboard');
        } else {
          setError(
            language === 'bn'
              ? 'পুলিশ অফিসার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি অথবা অ্যাকাউন্টটি নিষ্ক্রিয়।'
              : 'Police officer account not found or disabled.'
          );
        }
      } else if (activeTab === 'ADMIN') {
        await loginAsAdmin(email, password);
        onNavigate('admin-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {language === 'bn' ? 'সিস্টেমে প্রবেশ করুন' : 'System Login'}
          </h1>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'আপনার ভূমিকা অনুযায়ী সঠিক অ্যাকাউন্টে লগইন করুন'
              : 'Select your role to access authorized portal'}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('POLICE')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'POLICE'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'পুলিশ থানা' : 'Police Thana'}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('ADMIN')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'ADMIN'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('PUBLIC')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'PUBLIC'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'নাগরিক' : 'Citizen'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'POLICE'
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                : activeTab === 'ADMIN'
                ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('login')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {activeTab === 'PUBLIC' && (
          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {language === 'bn'
                ? 'নতুন নাগরিক অ্যাকাউন্ট তৈরি করুন (নিবন্ধন)'
                : 'Create new citizen account (Register)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
