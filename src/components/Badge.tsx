import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'gray' | 'red' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'sm',
  className = '',
  id
}) => {
  const variantClasses = {
    gold: 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30',
    emerald: 'bg-[#2e7d5b]/20 text-[#3ba776] border border-[#3ba776]/30',
    gray: 'bg-[#22252c] text-[#8e929b] border border-[#2c303a]',
    red: 'bg-[#c94a4a]/15 text-[#e06c6c] border border-[#c94a4a]/30',
    amber: 'bg-[#d99b38]/15 text-[#e5aa4a] border border-[#d99b38]/30'
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-md font-medium tracking-wide',
    md: 'text-sm px-3 py-1 rounded-md font-medium'
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};
