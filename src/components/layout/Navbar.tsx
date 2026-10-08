import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import {
  Shield, FileText, Search, Bell, Menu, X, LogOut, ChevronDown,
  UserCheck, Building2, Lock, Layers, HeartHandshake
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
    if (role === 'SUPER_ADMIN') return language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin';
    if (role === 'POLICE_USER') return policeUser?.thanaNameBn || policeUser?.thanaNameEn || (language === 'bn' ? 'পুলিশ কর্মকর্তা' : 'Police Officer');
    return language === 'bn' ? 'সাধারণ নাগরিক' : 'Citizen Reporter';
  };

  const navItems = [
    ['home', t('home')],
    ['report', t('reportIncident')],
    ['my-reports', t('myReports')],
    ['track', t('trackReport')],
    ['map', t('publicMap')],
    ['safety', t('safetyInfo')],
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#006a4e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নিরাপদ ও গোপনীয় নাগরিক রিপোর্টিং সেবা' : 'Secure & confidential citizen reporting service'}</span>
          </div>
          <div className="hidden md:block opacity-90">
            {language === 'bn' ? 'জরুরি সেবা: ৯৯৯' : 'Emergency: 999'}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => handleNav('home')} className="flex items-center gap-3 text-left min-w-0">
              <div className="w-12 h-12 rounded-full border-2 border-[#006a4e] bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#006a4e]" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-slate-900 truncate">{t('brandName')}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                  {language === 'bn' ? 'গোপনীয় নাগরিক তথ্য ও আইন প্রয়োগ সহায়তা ব্যবস্থা' : 'Confidential citizen information & law-enforcement support portal'}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {(role === 'POLICE_USER' || role === 'SUPER_ADMIN') && (
                <button
                  onClick={() => handleNav(role === 'POLICE_USER' ? 'police-notifications' : 'admin-dashboard')}
                  className="relative hidden sm:flex p-2 rounded-md border border-slate-200 text-slate-600 hover:text-[#006a4e] hover:border-emerald-200"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center px-1">{unreadCount}</span>}
                </button>
              )}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    onClick={() => handleNav(role === 'POLICE_USER' ? 'police-dashboard' : role === 'SUPER_ADMIN' ? 'admin-dashboard' : 'my-reports')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-emerald-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#006a4e]" />
                    <span className="max-w-[130px] truncate">{getRoleDisplayName()}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <button onClick={() => logout()} className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50" title={language === 'bn' ? 'লগআউট' : 'Logout'}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => handleNav('login')} className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#006a4e] text-white text-xs font-semibold hover:bg-[#00563f]">
                  <UserCheck className="w-4 h-4" />
                  {language === 'bn' ? 'লগইন / নিবন্ধন' : 'Login / Register'}
                </button>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-md border border-slate-200 text-slate-600">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden lg:block bg-[#00563f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          {navItems.map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => handleNav(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                currentTab === tab
                  ? 'bg-white/10 text-white border-[#d7b64a]'
                  : 'text-emerald-50 border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 py-1.5">
            {role === 'POLICE_USER' && (
              <button onClick={() => handleNav('police-dashboard')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#00563f] text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" /> {t('policePortal')}
              </button>
            )}
            {role === 'SUPER_ADMIN' && (
              <button onClick={() => handleNav('admin-dashboard')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#00563f] text-xs font-bold">
                <Layers className="w-3.5 h-3.5" /> {t('adminPortal')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="grid gap-1">
            {navItems.map(([tab, label]) => (
              <button key={tab} onClick={() => handleNav(tab)} className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                currentTab === tab ? 'bg-emerald-50 text-[#006a4e]' : 'text-slate-700 hover:bg-slate-50'
              }`}>
                {label}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 grid gap-1">
              {role === 'POLICE_USER' && <button onClick={() => handleNav('police-dashboard')} className="text-left px-3 py-2.5 rounded-md text-sm text-[#006a4e] font-semibold">{t('policePortal')}</button>}
              {role === 'SUPER_ADMIN' && <button onClick={() => handleNav('admin-dashboard')} className="text-left px-3 py-2.5 rounded-md text-sm text-[#006a4e] font-semibold">{t('adminPortal')}</button>}
              {!currentUser && <button onClick={() => handleNav('login')} className="text-left px-3 py-2.5 rounded-md text-sm text-slate-700">{t('login')} / {t('register')}</button>}
              {currentUser && <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left px-3 py-2.5 rounded-md text-sm text-red-600">{language === 'bn' ? 'লগআউট' : 'Logout'}</button>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;