import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PoliceUser, District, Thana } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Lock,
  Mail,
  Award
} from 'lucide-react';

export const AdminPolicePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [officers, setOfficers] = useState<PoliceUser[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form states for creating new officer
  const [fullName, setFullName] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState<string>('');
  const [rank, setRank] = useState<string>('Sub-Inspector (SI)');
  const [assignedDistrictId, setAssignedDistrictId] = useState<string>('');
  const [assignedThanaId, setAssignedThanaId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    dataService.getPoliceUsers().then(setOfficers);
    dataService.getDistricts().then(setDistricts);
    dataService.getThanas().then((list) => {
      setThanas(list);
      if (list.length > 0) {
        setAssignedThanaId((current) => list.some(t => t.id === current) ? current : list[0].id);
        setAssignedDistrictId((current) => current || list[0].districtId);
      }
    });
  }, []);

  const handleToggleStatus = async (uid: string) => {
    const updated = await dataService.togglePoliceAccountStatus(uid);
    if (updated) {
      setOfficers((prev) =>
        prev.map((o) => (o.uid === uid ? { ...o, isActive: updated.isActive } : o))
      );
    }
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    const selThana = thanas.find((t) => t.id === assignedThanaId);

    const newOfficer = await dataService.createPoliceUser({
      fullName,
      badgeNumber,
      rank,
      assignedDistrictId: selThana?.districtId || assignedDistrictId,
      assignedThanaId,
      thanaNameBn: selThana?.nameBn || 'থানা',
      thanaNameEn: selThana?.nameEn || 'Thana',
      email,
      password,
      isActive: true,
    });

    setOfficers((prev) => [...prev, newOfficer]);
    setShowCreateModal(false);
    // Reset form
    setFullName('');
    setBadgeNumber('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রশাসনিক কর্মকর্তা তালিকা' : 'Law Enforcement Accounts'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('managePoliceAccounts')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'bn'
              ? 'প্রতিটি থানার জন্য অনুমোদিত পুলিশ অ্যাকাউন্ট তৈরি ও পর্যবেক্ষণ করুন'
              : 'Create, authorize and assign police accounts to specific Thana jurisdictions'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('createPoliceAccount')}</span>
        </button>
      </div>

      {/* Officers List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {officers.map((officer) => (
          <div
            key={officer.uid}
            className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">
                  {officer.badgeNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    officer.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {officer.isActive ? t('active') : t('inactive')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{officer.fullName}</h3>
                <span className="text-xs text-slate-400">{officer.rank}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-emerald-400">
                    {language === 'bn' ? officer.thanaNameBn : officer.thanaNameEn}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{officer.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleStatus(officer.uid)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  officer.isActive
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {officer.isActive
                  ? (language === 'bn' ? 'অ্যাকাউন্ট নিষ্ক্রিয় করুন' : 'Deactivate')
                  : (language === 'bn' ? 'সক্রিয় করুন' : 'Activate')}
              </button>

              <span className="text-[10px] text-slate-500 font-mono">
                {officer.assignedThanaId}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Officer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>{t('createPoliceAccount')}</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('officerName')} *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ইন্সপেক্টর মো. করিম"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('badgeNumber')} *
                  </label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    placeholder="BP-9201824"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('rank')} *
                  </label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('assignThana')} *
                </label>
                <select
                  value={assignedThanaId}
                  onChange={(e) => setAssignedThanaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {thanas.map((th) => (
                    <option key={th.id} value={th.id}>
                      {language === 'bn' ? th.nameBn : th.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="police.thana@police.gov.bd"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  placeholder={language === 'bn' ? 'কমপক্ষে ৮ অক্ষর' : 'Minimum 8 characters'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {t('back')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  {language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPolicePage;
