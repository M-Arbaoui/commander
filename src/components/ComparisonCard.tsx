import React from 'react';
import { EquipmentItem, Language } from '../types';
import { translations } from '../services/localization';
import { Badge } from './Badge';
import { ArrowRight, Check, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface ComparisonCardProps {
  current: EquipmentItem;
  recommended: EquipmentItem;
  expectedDamageDiff: string;
  cost: number;
  reason: string;
  efficiencyScore: number;
  language: Language;
  onApply?: () => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  current,
  recommended,
  expectedDamageDiff,
  cost,
  reason,
  efficiencyScore,
  language,
  onApply
}) => {
  const t = translations[language];

  const diffAttack = recommended.attackBonus - current.attackBonus;
  const diffArmor = recommended.armorBonus - current.armorBonus;
  const diffPrecision = recommended.precisionBonus - current.precisionBonus;
  const diffCrit = (recommended.critChanceBonus - current.critChanceBonus) * 100;

  return (
    <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-[#f4f4f2]">{t.comparison}</h4>
          <p className="text-xs text-[#8e929b]">{t.currentVsRecommended}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Optimal Step</Badge>
          <span className="text-xs text-[#8e929b]">Efficiency: {(efficiencyScore * 100).toFixed(3)}</span>
        </div>
      </div>

      {/* Side by side columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current */}
        <div className="p-4 rounded-lg bg-[#111215] border border-[#23262f]">
          <div className="text-xs text-[#8e929b] font-medium uppercase mb-2">Current Loadout</div>
          <div className="font-semibold text-sm text-[#f4f4f2] mb-1">{current.name}</div>
          <div className="text-xs text-[#8e929b] mb-3">Tier {current.level} • {current.rarity}</div>
          <div className="space-y-1.5 text-xs text-[#d4d6db]">
            <div className="flex justify-between"><span>Attack:</span><span className="font-medium">+{current.attackBonus}</span></div>
            <div className="flex justify-between"><span>Armor:</span><span className="font-medium">+{current.armorBonus}</span></div>
            <div className="flex justify-between"><span>Precision:</span><span className="font-medium">+{current.precisionBonus}</span></div>
            <div className="flex justify-between"><span>Critical Chance:</span><span className="font-medium">+{(current.critChanceBonus * 100).toFixed(0)}%</span></div>
          </div>
        </div>

        {/* Recommended */}
        <div className="p-4 rounded-lg bg-[#111215] border border-[#c5a059]/30">
          <div className="flex items-center justify-between text-xs text-[#c5a059] font-medium uppercase mb-2">
            <span>Target Upgrade</span>
            <Badge variant="emerald" size="sm">Upgrade</Badge>
          </div>
          <div className="font-semibold text-sm text-[#f4f4f2] mb-1">{recommended.name}</div>
          <div className="text-xs text-[#8e929b] mb-3">Tier {recommended.level} • {recommended.rarity}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#d4d6db]">
              <span>Attack:</span>
              <span className="font-medium text-[#3ba776]">+{recommended.attackBonus} ({diffAttack > 0 ? `+${diffAttack}` : diffAttack})</span>
            </div>
            <div className="flex justify-between text-[#d4d6db]">
              <span>Armor:</span>
              <span className="font-medium text-[#3ba776]">+{recommended.armorBonus} ({diffArmor > 0 ? `+${diffArmor}` : diffArmor})</span>
            </div>
            <div className="flex justify-between text-[#d4d6db]">
              <span>Precision:</span>
              <span className="font-medium text-[#3ba776]">+{recommended.precisionBonus} ({diffPrecision > 0 ? `+${diffPrecision}` : diffPrecision})</span>
            </div>
            <div className="flex justify-between text-[#d4d6db]">
              <span>Critical Chance:</span>
              <span className="font-medium text-[#3ba776]">
                +{(recommended.critChanceBonus * 100).toFixed(0)}% ({diffCrit > 0 ? `+${diffCrit.toFixed(0)}%` : `${diffCrit}%`})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#111215] rounded-lg border border-[#23262f] mb-4">
        <div>
          <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#3ba776]" />
            {t.damageGain}
          </span>
          <span className="text-sm font-bold text-[#3ba776]">{expectedDamageDiff}</span>
        </div>
        <div>
          <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-0.5">
            <DollarSign className="w-3.5 h-3.5 text-[#c5a059]" />
            {t.costToUpgrade}
          </span>
          <span className="text-sm font-bold text-[#c5a059]">{cost} coins</span>
        </div>
        <div>
          <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-0.5">
            <Activity className="w-3.5 h-3.5 text-[#4a88c9]" />
            {t.efficiencyGain}
          </span>
          <span className="text-sm font-bold text-[#f4f4f2]">{(efficiencyScore * 100).toFixed(3)} pts/coin</span>
        </div>
      </div>

      {/* Strategic Reason */}
      <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f] text-xs text-[#d4d6db] mb-4">
        <span className="font-semibold text-[#c5a059] block mb-1">{t.reason}:</span>
        {reason}
      </div>

      {onApply && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onApply}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#d4af37] text-[#111215] font-semibold text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Upgrade Slot ({cost} coins)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
