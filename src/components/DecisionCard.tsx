import React, { useState } from 'react';
import { DecisionCardData, Language } from '../types';
import { translations } from '../services/localization';
import { Badge } from './Badge';
import { ChevronDown, ChevronUp, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface DecisionCardProps {
  decision: DecisionCardData;
  language: Language;
  onAction?: (decision: DecisionCardData) => void;
  isPrimary?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  language,
  onAction,
  isPrimary = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[language];

  const getVerdictVariant = (verdict: string): 'gold' | 'emerald' | 'amber' | 'red' | 'gray' => {
    switch (verdict) {
      case 'Recommended':
      case 'Buy':
        return isPrimary ? 'gold' : 'emerald';
      case 'Wait':
        return 'amber';
      case 'Avoid':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getVerdictTranslated = (verdict: string) => {
    return t.verdicts[verdict as keyof typeof t.verdicts] || verdict;
  };

  return (
    <div
      id={`decision-card-${decision.id}`}
      className={`rounded-xl border transition-all duration-200 ${
        isPrimary
          ? 'bg-[#1a1c22] border-[#c5a059]/40 shadow-lg shadow-black/40 p-6'
          : 'bg-[#181a1f] border-[#2c303a] hover:border-[#3e4452] p-5'
      }`}
    >
      {/* 1. Decision Header & Verdict */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          {isPrimary && (
            <div className="flex items-center gap-1.5 text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.primaryDecision}</span>
            </div>
          )}
          <h3 className={`font-semibold text-[#f4f4f2] ${isPrimary ? 'text-lg md:text-xl' : 'text-base'}`}>
            {decision.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={getVerdictVariant(decision.verdict)} size={isPrimary ? 'md' : 'sm'}>
            {decision.verdict === 'Recommended' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {decision.verdict === 'Avoid' && <ShieldAlert className="w-3.5 h-3.5" />}
            {getVerdictTranslated(decision.verdict)}
          </Badge>
          <span className="text-[11px] text-[#8e929b] border border-[#2c303a] px-2 py-0.5 rounded bg-[#111215]">
            {t.confidence}: {decision.confidence}
          </span>
        </div>
      </div>

      {/* 2. Expected Outcome & 3. Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#111215] border border-[#23262f] mb-4">
        <div>
          <span className="text-xs text-[#8e929b] block mb-0.5">{t.expectedResult}</span>
          <span className="text-sm font-semibold text-[#f4f4f2]">{decision.expectedResult}</span>
        </div>
        <div>
          <span className="text-xs text-[#8e929b] block mb-0.5">{t.cost}</span>
          <span className="text-sm font-semibold text-[#c5a059]">{decision.cost}</span>
        </div>
      </div>

      {/* 4. Reason */}
      <div className="mb-4">
        <span className="text-xs text-[#8e929b] block mb-1 font-medium">{t.reason}:</span>
        <p className="text-sm text-[#d4d6db] leading-relaxed">
          {decision.reason}
        </p>
      </div>

      {/* Tradeoffs if present */}
      {decision.tradeOffs && (
        <div className="mb-4 text-xs text-[#8e929b] flex items-center gap-1.5">
          <span className="font-medium text-[#c94a4a]/90">{t.opportunityCost}:</span>
          <span>{decision.tradeOffs}</span>
        </div>
      )}

      {/* 5. Progressive Disclosure: Details / Calculations */}
      {decision.details && decision.details.length > 0 && (
        <div className="mb-4 border-t border-[#23262f] pt-3">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-[#c5a059] hover:text-[#d4af37] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showDetails ? t.hideDetails : t.whyThisRecommendation}
          </button>

          {showDetails && (
            <div className="mt-2.5 p-3 rounded-md bg-[#111215]/80 border border-[#2c303a] text-xs text-[#8e929b] space-y-1.5">
              {decision.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#c5a059]">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[#8e929b]">
          {decision.efficiencyScore ? `${t.efficiencyMetric}: ${(decision.efficiencyScore * 100).toFixed(3)}` : ''}
        </span>
        <button
          type="button"
          onClick={() => onAction && onAction(decision)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            decision.verdict === 'Avoid'
              ? 'bg-[#22252c] hover:bg-[#2c303a] text-[#8e929b]'
              : isPrimary
              ? 'bg-[#c5a059] hover:bg-[#d4af37] text-[#111215]'
              : 'bg-[#22252c] hover:bg-[#2c303a] text-[#f4f4f2] border border-[#2c303a]'
          }`}
        >
          <span>{decision.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
