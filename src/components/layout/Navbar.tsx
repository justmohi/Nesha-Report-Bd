import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import {
  Shield,
  FileText,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCheck,
  Building2,
  Lock,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, policeUser, role, logout } = useAuth();
  const { t, language } = useLanguage();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const getRoleDisplayName = () => {
    if (role === 'SUPER_ADMIN') {
      return language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin';
    }
    if (role === 'POLICE_USER') {
      return policeUser ? `${policeUser.thanaNameBn || policeUser.thanaNameEn}` : (language === 'bn' ? 'পুলিশ কর্মকর্তা' : 'Police Officer');
    }
    return language === 'bn' ? 'সাধারণ নাগরিক' : 'Citizen Reporter';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-[#006a4e] border-b border-[#00563f] px-4 py-1 text-xs text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'bn'
              ? 'আইনি ঘোষণা: এটি কোনো পাবলিক ব্ল্যাকলিস্ট নয়। সকল রিপোর্ট কঠোরভাবে গোপনীয়।'
              : 'Legal Notice: This is NOT a public blacklist. Submissions remain strictly confidential.'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
            {language === 'bn' ? 'জরুরি সেবা: ৯৯৯ | মাদক নিয়ন্ত্রণ অধিদপ্তর: ১৬১২৪' : 'Emergency: 999 | DNC: 16124'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {t('brandName')}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden md:inline-block">
                  Confidential
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {language === 'bn' ? 'মাদক-বিরোধী গোপনীয় রিপোর্ট ও পুলিশ তথ্য ব্যবস্থা' : 'Confidential Narcotics Reporting & Law Enforcement'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentTab === 'home'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('home')}
            </button>

            <button
              onClick={() => handleNav('report')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                currentTab === 'report'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-sm'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t('reportIncident')}
            </button>

            <button
              onClick={() => handleNav('my-reports')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentTab === 'my-reports'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('myReports')}
            </button>

            <button
              onClick={() => handleNav('track')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                currentTab === 'track'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              {t('trackReport')}
            </button>

            <button
              onClick={() => handleNav('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentTab === 'map'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('publicMap')}
            </button>

            <button
              onClick={() => handleNav('safety')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                currentTab === 'safety'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              {t('safetyInfo')}
            </button>

            {/* Portal Direct Links based on role or explorer */}
            <div className="h-5 w-px bg-slate-800 mx-2" />

            {role === 'POLICE_USER' ? (
              <button
                onClick={() => handleNav('police-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab.startsWith('police')
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-950/60 border border-blue-800 text-blue-300 hover:bg-blue-900/80'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                {t('policePortal')}
              </button>
            ) : role === 'SUPER_ADMIN' ? (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab.startsWith('admin')
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-950/60 border border-purple-800 text-purple-300 hover:bg-purple-900/80'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                {t('adminPortal')}
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                {t('policePortal')}
              </button>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Notifications for Police / Admin */}
            {(role === 'POLICE_USER' || role === 'SUPER_ADMIN') && (
              <button
                onClick={() => handleNav(role === 'POLICE_USER' ? 'police-notifications' : 'admin-dashboard')}
                className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Authenticated role / login control — no demo role switching */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate(role === 'POLICE_USER' ? 'police-dashboard' : role === 'SUPER_ADMIN' ? 'admin-dashboard' : 'my-reports')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  <span className={`w-2 h-2 rounded-full ${role === 'SUPER_ADMIN' ? 'bg-purple-500' : role === 'POLICE_USER' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                  <span className="max-w-[140px] truncate">{getRoleDisplayName()}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => logout()}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                  title={language === 'bn' ? 'লগআউট' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition"
              >
                <UserCheck className="w-4 h-4 text-[#006a4e]" />
                {language === 'bn' ? 'লগইন / নিবন্ধন' : 'Login / Register'}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-900/98 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {t('home')}
          </button>
          <button
            onClick={() => handleNav('report')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white"
          >
            {t('reportIncident')}
          </button>
          <button
            onClick={() => handleNav('my-reports')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {t('myReports')}
          </button>
          <button
            onClick={() => handleNav('track')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {t('trackReport')}
          </button>
          <button
            onClick={() => handleNav('map')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {t('publicMap')}
          </button>
          <button
            onClick={() => handleNav('safety')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {t('safetyInfo')}
          </button>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs uppercase font-semibold text-slate-400 px-3 py-1">Portals</div>
            <button
              onClick={() => handleNav('police-dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-300 hover:bg-slate-800"
            >
              {t('policePortal')}
            </button>
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-slate-800"
            >
              {t('adminPortal')}
            </button>
            <button
              onClick={() => handleNav('login')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800"
            >
              {t('login')} / {t('register')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
