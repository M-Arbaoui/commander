import React from 'react';
import { EquipmentItem, Language } from '../types';
import { translations } from '../services/localization';
import { Badge } from './Badge';
import { ItemIcon, ItemQuality } from './ItemIcon';
import { Shield, Crosshair, Zap, ArrowUp } from 'lucide-react';

interface EquipmentCardProps {
  item: EquipmentItem;
  language: Language;
  onUpgrade?: (item: EquipmentItem) => void;
  isRecommended?: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  language,
  onUpgrade,
  isRecommended = false
}) => {
  const t = translations[language];

  const slotLabels = {
    weapon: t.slotWeapon,
    helmet: t.slotHelmet,
    chest: t.slotChest,
    pants: t.slotPants,
    boots: t.slotBoots,
    gloves: t.slotGloves
  };

  const mapRarityToQuality = (rarity: string): ItemQuality => {
    switch (rarity) {
      case 'Common': return 'grey';
      case 'Uncommon': return 'green';
      case 'Rare': return 'blue';
      case 'Epic': return 'purple';
      case 'Legendary': return 'gold';
      default: return 'none';
    }
  };

  const rarityQuality = mapRarityToQuality(item.rarity);

  const rarityColor = {
    Common: 'border-[#2c303a]',
    Uncommon: 'border-[#3ba776]/40 text-[#3ba776]',
    Rare: 'border-[#4a88c9]/40 text-[#4a88c9]',
    Epic: 'border-[#8e6ec9]/40 text-[#a37ee8]',
    Legendary: 'border-[#c5a059]/50 text-[#c5a059]'
  }[item.rarity];

  // Specific weapon image map based on item name
  const getItemKey = () => {
    if (item.slot === 'weapon') {
      const lower = item.name.toLowerCase();
      if (lower.includes('knife')) return 'knife';
      if (lower.includes('pistol') || lower.includes('gun')) return 'gun';
      if (lower.includes('rifle') && !lower.includes('sniper')) return 'rifle';
      if (lower.includes('sniper')) return 'sniper';
      if (lower.includes('tank')) return 'tank';
      if (lower.includes('jet')) return 'jet';
      return 'rifle';
    }
    return item.slot;
  };

  return (
    <div
      className={`rounded-xl border p-4 bg-[#181a1f] flex flex-col justify-between transition-all ${
        isRecommended ? 'border-[#c5a059]/40 bg-[#1c1f26]' : 'border-[#2c303a]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-xs text-[#8e929b] mb-2">
          <span className="font-medium uppercase tracking-wider">{slotLabels[item.slot]}</span>
          <span className="text-[11px] font-mono bg-[#111215] px-2 py-0.5 rounded border border-[#2c303a]">
            Tier {item.level} / {item.maxLevel}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {/* Authentic In-Game Item Logo */}
          <ItemIcon
            item={item.id || item.artworkCode || getItemKey()}
            quality={rarityQuality}
            size="lg"
            alt={item.name}
          />
          <div>
            <h4 className="text-sm font-semibold text-[#f4f4f2] leading-snug">{item.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[11px] font-medium ${rarityColor}`}>{item.rarity}</span>
              {isRecommended && (
                <Badge variant="gold" size="sm">Recommended</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 bg-[#111215] rounded-lg border border-[#23262f] mb-3">
          {item.attackBonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#8e929b] flex items-center gap-1"><Zap className="w-3 h-3 text-[#c5a059]" /> ATK:</span>
              <span className="font-semibold text-[#f4f4f2]">+{item.attackBonus}</span>
            </div>
          )}
          {item.armorBonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#8e929b] flex items-center gap-1"><Shield className="w-3 h-3 text-[#3ba776]" /> ARM:</span>
              <span className="font-semibold text-[#f4f4f2]">+{item.armorBonus}</span>
            </div>
          )}
          {item.precisionBonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#8e929b] flex items-center gap-1"><Crosshair className="w-3 h-3 text-[#4a88c9]" /> PRC:</span>
              <span className="font-semibold text-[#f4f4f2]">+{item.precisionBonus}</span>
            </div>
          )}
          {item.critChanceBonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#8e929b]">CRIT:</span>
              <span className="font-semibold text-[#c5a059]">+{(item.critChanceBonus * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#23262f] mt-auto">
        <span className="text-xs text-[#8e929b]">
          Cost: <span className="font-semibold text-[#c5a059]">{item.upgradeCost} coins</span>
        </span>
        {onUpgrade && (
          <button
            type="button"
            onClick={() => onUpgrade(item)}
            className="text-xs font-semibold px-2.5 py-1.5 bg-[#22252c] hover:bg-[#2c303a] text-[#f4f4f2] rounded-md flex items-center gap-1 border border-[#2c303a] cursor-pointer"
          >
            <ArrowUp className="w-3 h-3 text-[#c5a059]" />
            <span>Upgrade</span>
          </button>
        )}
      </div>
    </div>
  );
};
