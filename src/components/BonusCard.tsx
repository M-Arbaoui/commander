import React, { useState } from 'react';
import { WarBonusBreakdown, Language } from '../types';
import { translations } from '../services/localization';
import { ChevronDown, ChevronUp, Calculator, Shield, Award, Flag, Zap } from 'lucide-react';

interface BonusCardProps {
  bonuses: WarBonusBreakdown;
  language: Language;
}

export const BonusCard: React.FC<BonusCardProps> = ({ bonuses, language }) => {
  const [showFormula, setShowFormula] = useState(false);
  const t = translations[language];

  return (
    <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-[#f4f4f2]">{t.bonusBreakdownTitle}</h4>
          <p className="text-xs text-[#8e929b]">{t.calculationFormulaNote}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#8e929b] block">{t.totalApplicableBonus}</span>
          <span className="text-xl font-bold text-[#c5a059]">+{Math.round((bonuses.totalMultiplier - 1) * 100)}%</span>
          <span className="text-[11px] text-[#8e929b] block">({bonuses.totalMultiplier}x base)</span>
        </div>
      </div>

      {/* Breakdown categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
          <div className="flex items-center gap-1.5 text-xs text-[#8e929b] mb-1">
            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{t.personalBonus}</span>
          </div>
          <div className="text-base font-bold text-[#f4f4f2]">+{bonuses.personalBonusPercent}%</div>
        </div>

        <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
          <div className="flex items-center gap-1.5 text-xs text-[#8e929b] mb-1">
            <Shield className="w-3.5 h-3.5 text-[#3ba776]" />
            <span>{t.muBonus}</span>
          </div>
          <div className="text-base font-bold text-[#f4f4f2]">+{bonuses.militaryUnitBonusPercent}%</div>
        </div>

        <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
          <div className="flex items-center gap-1.5 text-xs text-[#8e929b] mb-1">
            <Flag className="w-3.5 h-3.5 text-[#8e929b]" />
            <span>{t.countryBonus}</span>
          </div>
          <div className="text-base font-bold text-[#f4f4f2]">+{bonuses.countryBonusPercent}%</div>
        </div>

        <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
          <div className="flex items-center gap-1.5 text-xs text-[#8e929b] mb-1">
            <Zap className="w-3.5 h-3.5 text-[#d99b38]" />
            <span>{t.specialPillBonus}</span>
          </div>
          <div className="text-base font-bold text-[#d99b38]">+{bonuses.specialPillsPercent}%</div>
        </div>
      </div>

      {/* Transparent Calculation disclosure */}
      <div className="border-t border-[#23262f] pt-3">
        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="text-xs text-[#c5a059] hover:text-[#d4af37] flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{showFormula ? t.hideDetails : t.transparentCalculation}</span>
          {showFormula ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showFormula && (
          <div className="mt-3 p-3.5 rounded-lg bg-[#111215] border border-[#2c303a] text-xs font-mono">
            <div className="text-[#8e929b] mb-1 text-[11px] font-sans">
              Verified Multiplicative Pipeline:
            </div>
            <div className="text-[#c5a059] font-medium break-all py-1">
              Multiplier = {bonuses.explanationFormula} = {bonuses.totalMultiplier}x
            </div>
            <div className="text-[#8e929b] text-[11px] font-sans mt-2 border-t border-[#23262f] pt-2">
              ✓ Grounded in live War Era battle log audits. Additive grouping only occurs within same modifier source; cross-source compounds multiplicatively.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
