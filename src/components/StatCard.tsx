import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'gold' | 'emerald';
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  id
}) => {
  const borderStyle = {
    default: 'border-[#2c303a]',
    gold: 'border-[#c5a059]/30',
    emerald: 'border-[#3ba776]/30'
  }[variant];

  const valueStyle = {
    default: 'text-[#f4f4f2]',
    gold: 'text-[#c5a059]',
    emerald: 'text-[#3ba776]'
  }[variant];

  return (
    <div
      id={id}
      className={`bg-[#181a1f] border ${borderStyle} rounded-xl p-4 transition-all`}
    >
      <div className="flex items-center justify-between text-xs text-[#8e929b] mb-1.5">
        <span className="font-medium">{label}</span>
        {icon && <span className="text-[#8e929b]">{icon}</span>}
      </div>
      <div className={`text-xl font-bold tracking-tight ${valueStyle}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-[#8e929b] mt-1 truncate">
          {subtext}
        </div>
      )}
    </div>
  );
};
