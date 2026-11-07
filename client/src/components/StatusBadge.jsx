import React from 'react';
import { Clock, Building2, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  let config = {
    bg: 'bg-amber-50 border-amber-200 text-amber-700',
    icon: Clock,
    label: 'Reported'
  };

  if (status === 'Turned In to Office') {
    config = {
      bg: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: Building2,
      label: 'In Office'
    };
  } else if (status === 'Claimed') {
    config = {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: CheckCircle2,
      label: 'Claimed'
    };
  }

  const Icon = config.icon;
  const isLg = size === 'lg';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight ${config.bg} ${
        isLg ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
      }`}
    >
      <Icon className={isLg ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
