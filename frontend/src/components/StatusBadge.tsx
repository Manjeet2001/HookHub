import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  outcome: 'SUCCESS' | 'FAILED_ATTEMPT' | 'FAILURE';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ outcome }) => {
  const getStatusConfig = () => {
    switch (outcome) {
      case 'SUCCESS':
        return {
          icon: CheckCircle,
          text: 'Success',
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
        };
      case 'FAILED_ATTEMPT':
        return {
          icon: AlertCircle,
          text: 'Retry',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        };
      case 'FAILURE':
        return {
          icon: XCircle,
          text: 'Failed',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
      default:
        return {
          icon: AlertCircle,
          text: outcome,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon size={14} />
      {config.text}
    </span>
  );
};

export default StatusBadge;
