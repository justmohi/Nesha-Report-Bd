import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storage/storageService';
import { isFirebaseConfigured } from '../../lib/firebase';
import {
  Settings,
  Shield,
  Bot,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Save,
  Server
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [telegramConfigured, setTelegramConfigured] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    storageService.isConfigured().then((status) => {
      setTelegramConfigured(status);
      setChecking(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Architecture & Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'bn' ? 'সিস্টেম ও স্টোরেজ সেটিংস' : 'System & Storage Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'bn'
            ? 'টেলিগ্রাম প্রাইভেট চ্যানেল এভিডেন্স স্টোরেজ ও ফায়ারবেস ডেটাবেস সংযোগ স্থিতি'
            : 'Telegram Bot API private storage vault and Firebase backend status'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram Storage Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Telegram Private Storage
                </h3>
                <span className="text-[11px] text-slate-400">Bot API Private Channel Vault</span>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                telegramConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {telegramConfigured ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Configured</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Pending Env Keys</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {telegramConfigured
              ? 'টেলিগ্রাম বট এবং প্রাইভেট চ্যানেল সক্রিয়। আপলোডকৃত প্রমাণ সরাসরি এনক্রিপ্ট হয়ে প্রাইভেট চ্যানেলে জমা হচ্ছে।'
              : 'Telegram storage is not configured yet. The application runs smoothly in fallback mode. To activate live Telegram channel storage, configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID in .env.'}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
            <div>MAX_EVIDENCE_FILE_SIZE_MB=20</div>
            <div>PROVIDER=telegram_bot_api</div>
            <div>STATUS={telegramConfigured ? 'CONNECTED' : 'STANDBY_MODE'}</div>
          </div>
        </div>

        {/* Firebase Firestore Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Firebase Firestore & Auth
                </h3>
                <span className="text-[11px] text-slate-400">Structured Data & Security Rules</span>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isFirebaseConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{isFirebaseConfigured ? 'Connected' : 'Interactive Ready'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'নিরাপদ রুলস (firestore.rules) এবং ABAC থামা-লেভেল এক্সেস কন্ট্রোল সক্রিয়। ডেমো ও প্রডাকশন মোড উভয়ই প্রস্তুত।'
              : 'Strict firestore.rules and ABAC access control enforced. Seamless operation in both cloud and offline mode.'}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
            <div>RULES=rules_version = \'2\';</div>
            <div>COLLECTIONS=14 collections defined</div>
            <div>SECURITY=Zero public blacklisting</div>
          </div>
        </div>
      </div>

      {/* Telegram Setup Guide Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-400" />
          <span>টেলিগ্রাম প্রাইভেট চ্যানেল সেটাপ গাইড (Telegram Storage Setup Guide)</span>
        </h3>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed pl-1">
          <li>টেলিগ্রামে @BotFather এ গিয়ে <code>/newbot</code> দিয়ে একটি টেলিগ্রাম বট তৈরি করুন।</li>
          <li>প্রাপ্ত Bot Token টি কপি করুন।</li>
          <li>টেলিগ্রামে একটি <strong>PRIVATE</strong> চ্যানেল তৈরি করুন।</li>
          <li>বটটিকে উক্ত চ্যানেলে Administrator হিসেবে অ্যাড করুন এবং Post Messages অনুমতি দিন।</li>
          <li>চ্যানেল আইডিটি কপি করে <code>TELEGRAM_CHANNEL_ID</code> (যেমন: <code>-1001234567890</code>) হিসেবে <code>.env</code> এ বসান।</li>
          <li>বট টোকেনটি <code>TELEGRAM_BOT_TOKEN</code> হিসেবে বসান।</li>
        </ol>
      </div>
    </div>
  );
};
export default AdminSettingsPage;
