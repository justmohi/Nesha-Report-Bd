import React from 'react';
import { ReportStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          label: t('status_SUBMITTED'),
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          label: t('status_UNDER_REVIEW'),
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          label: t('status_VERIFIED'),
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          label: t('status_REJECTED'),
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      case 'ACTION_TAKEN':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          label: t('status_ACTION_TAKEN'),
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case 'CLOSED':
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          label: t('status_CLOSED'),
          icon: <Archive className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-slate-700 text-slate-300 border-slate-600',
          label: status,
          icon: null,
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
export default StatusBadge;
