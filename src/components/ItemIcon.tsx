import React, { useState } from 'react';
import { getEquipmentAsset, ItemQualityTier } from '../services/gameData';

export type ItemQuality = ItemQualityTier;

interface ItemIconProps {
  item: string; // Accepts equipment ID (e.g. 'eq_wp_q3', 'eq_hl_q2'), artworkCode ('rifle_q1'), or name ('knife', 'rifle', 'bread')
  quality?: ItemQuality;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  alt?: string;
}

const QUALITY_BORDER_MAP: Record<ItemQuality, string> = {
  none: 'border-[#2d3240] bg-[#161822]',
  grey: 'border-zinc-500/50 bg-zinc-950/60 shadow-zinc-900/50',
  green: 'border-emerald-500/50 bg-emerald-950/40 shadow-emerald-900/30',
  blue: 'border-blue-500/50 bg-blue-950/40 shadow-blue-900/30',
  purple: 'border-purple-500/50 bg-purple-950/40 shadow-purple-900/30',
  gold: 'border-amber-400/70 bg-amber-950/40 shadow-amber-900/40',
  red: 'border-red-500/70 bg-red-950/40 shadow-red-900/40'
};

const SIZE_MAP = {
  xs: { box: 'w-6 h-6 p-0.5', img: 'w-full h-full' },
  sm: { box: 'w-8 h-8 p-1', img: 'w-full h-full' },
  md: { box: 'w-10 h-10 p-1.5', img: 'w-full h-full' },
  lg: { box: 'w-14 h-14 p-2', img: 'w-full h-full' },
  xl: { box: 'w-20 h-20 p-2.5', img: 'w-full h-full' }
};

export const ItemIcon: React.FC<ItemIconProps> = ({
  item,
  quality,
  size = 'md',
  className = '',
  showBorder = true,
  alt
}) => {
  const [useFallbackCdn, setUseFallbackCdn] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Resolve through the unified War Era asset mapping utility
  const assetMeta = getEquipmentAsset(item);
  const resolvedQuality = quality !== undefined && quality !== 'none' ? quality : assetMeta.quality;

  const currentSrc = useFallbackCdn ? assetMeta.cdnUrl : assetMeta.imagePath;

  const sizeClass = SIZE_MAP[size];
  const borderClass = showBorder ? `rounded-lg border ${QUALITY_BORDER_MAP[resolvedQuality]} shadow-sm` : '';

  const handleImageError = () => {
    if (!useFallbackCdn) {
      // First retry with official CDN
      setUseFallbackCdn(true);
    } else {
      // If CDN fails too, show abbreviation badge
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`inline-flex items-center justify-center font-bold text-[10px] text-slate-400 uppercase ${sizeClass.box} ${borderClass} ${className}`}
        title={alt || assetMeta.label || item}
      >
        {item.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 transition-transform ${sizeClass.box} ${borderClass} ${className}`}
      title={alt || assetMeta.label || item}
    >
      <img
        src={currentSrc}
        alt={alt || assetMeta.label || item}
        referrerPolicy="no-referrer"
        onError={handleImageError}
        className={`object-contain ${sizeClass.img} filter drop-shadow`}
      />
    </div>
  );
};

