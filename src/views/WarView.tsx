import React, { useState } from 'react';
import { WarDTO, PlayerDTO, Language } from '../types';
import { translations } from '../services/localization';
import { BonusCard } from '../components/BonusCard';
import { RecommendationEngine } from '../services/recommendationEngine';
import { Badge } from '../components/Badge';
import {
  Swords,
  Search,
  Clock,
  Shield,
  Flag,
  CheckCircle,
  HelpCircle,
  Pill,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface WarViewProps {
  wars: WarDTO[];
  selectedWar: WarDTO | null;
  onSelectWar: (war: WarDTO) => void;
  player: PlayerDTO;
  language: Language;
}

export const WarView: React.FC<WarViewProps> = ({
  wars,
  selectedWar,
  onSelectWar,
  player,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'defense' | 'attack'>('all');
  const [usePill, setUsePill] = useState(true);
  const t = translations[language];

  // Filter wars
  const filteredWars = wars.filter((w) => {
    const matchSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.attackerCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.defenderCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.region.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filterType === 'active') return w.status === 'Active';
    if (filterType === 'defense') return w.type === 'Defensive Pact' || w.playerSide === 'Defender';
    if (filterType === 'attack') return w.playerSide === 'Attacker';
    return true;
  });

  const activeWar = selectedWar || wars[0];
  const calculatedBonuses = activeWar
    ? RecommendationEngine.calculateWarBonuses(player, activeWar, usePill)
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Philosophy Statement */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f2]">
          {t.warTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#8e929b] mt-0.5">
          {t.warSubtitle}
        </p>
      </div>

      {/* Strict Rule Banner: QASWARA never recommends a war */}
      <div className="p-3.5 rounded-xl bg-[#181a1f] border border-[#2c303a] flex items-start gap-3 text-xs text-[#8e929b]">
        <HelpCircle className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#f4f4f2] block mb-0.5">War Policy Principle</span>
          {t.warSelectionNote}
        </div>
      </div>

      {/* War Selector Section */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8e929b] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchWars}
              className="w-full bg-[#111215] border border-[#2c303a] rounded-lg ps-9 pe-3 py-2 text-xs text-[#f4f4f2] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                  : 'text-[#8e929b] hover:bg-[#111215]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('active')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'active'
                  ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                  : 'text-[#8e929b] hover:bg-[#111215]'
              }`}
            >
              {t.filterActive}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('attack')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'attack'
                  ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                  : 'text-[#8e929b] hover:bg-[#111215]'
              }`}
            >
              {t.filterAttack}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('defense')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'defense'
                  ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                  : 'text-[#8e929b] hover:bg-[#111215]'
              }`}
            >
              {t.filterDefense}
            </button>
          </div>
        </div>

        {/* War Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredWars.map((war) => {
            const isSelected = activeWar?.id === war.id;
            return (
              <div
                key={war.id}
                onClick={() => onSelectWar(war)}
                className={`p-4 rounded-xl border text-start cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1c1f26] border-[#c5a059]/50 shadow-md shadow-black/40'
                    : 'bg-[#111215] border-[#23262f] hover:border-[#3e4452]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={war.status === 'Active' ? 'emerald' : 'amber'} size="sm">
                    {war.status}
                  </Badge>
                  <span className="text-[11px] text-[#8e929b] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {war.timeRemainingMinutes}m
                  </span>
                </div>

                <div className="font-semibold text-xs text-[#f4f4f2] mb-1 line-clamp-1">
                  {war.title}
                </div>

                <div className="text-xs text-[#8e929b] flex items-center justify-between py-1.5 border-y border-[#23262f] my-2">
                  <span className="font-medium text-[#f4f4f2]">{war.attackerCountryCode}</span>
                  <span className="text-[10px] text-[#c5a059] font-mono">
                    {war.attackerScore} : {war.defenderScore}
                  </span>
                  <span className="font-medium text-[#f4f4f2]">{war.defenderCountryCode}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8e929b]">
                  <span>Round {war.currentRound} of {war.rounds}</span>
                  {isSelected && (
                    <span className="text-[#c5a059] font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected War Deep Analysis */}
      {activeWar && calculatedBonuses && (
        <div className="space-y-6">
          {/* War Header details */}
          <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#23262f] mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#22252c] text-[#c5a059] font-medium border border-[#2c303a]">
                    {activeWar.type} War
                  </span>
                  <span className="text-xs text-[#8e929b]">{activeWar.region}</span>
                </div>
                <h3 className="text-lg font-bold text-[#f4f4f2]">{activeWar.title}</h3>
              </div>

              {/* Stim Pill toggle for calculation */}
              <div className="flex items-center gap-3 bg-[#111215] px-3.5 py-2 rounded-lg border border-[#23262f]">
                <Pill className={`w-4 h-4 ${usePill ? 'text-[#c5a059]' : 'text-[#8e929b]'}`} />
                <div className="text-xs">
                  <span className="text-[#f4f4f2] font-medium block">Combat Stim Pill (+60%)</span>
                  <span className="text-[10px] text-[#8e929b]">Include consumable in calculation</span>
                </div>
                <input
                  type="checkbox"
                  checked={usePill}
                  onChange={(e) => setUsePill(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a059] cursor-pointer"
                />
              </div>
            </div>

            {/* Combat estimates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
                <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#3ba776]" />
                  {t.estimatedDamage}
                </span>
                <span className="text-base font-bold text-[#3ba776]">
                  {Math.round(activeWar.baseDamagePerHit * calculatedBonuses.totalMultiplier * 40).toLocaleString()} DMG
                </span>
                <span className="text-[10px] text-[#8e929b] block mt-0.5">
                  Across 40 energy hits (~2 full bars)
                </span>
              </div>

              <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
                <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#c5a059]" />
                  {t.estimatedCost}
                </span>
                <span className="text-base font-bold text-[#c5a059]">
                  {activeWar.estimatedCoinsCost + (usePill ? 850 : 0)} coins
                </span>
                <span className="text-[10px] text-[#8e929b] block mt-0.5">
                  Includes ammo wear & {usePill ? 'pill cost' : 'zero pill'}
                </span>
              </div>

              <div className="p-3 bg-[#111215] rounded-lg border border-[#23262f]">
                <span className="text-xs text-[#8e929b] flex items-center gap-1 mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#4a88c9]" />
                  Military Unit Alliance
                </span>
                <span className="text-base font-bold text-[#f4f4f2]">
                  {player.militaryUnit}
                </span>
                <span className="text-[10px] text-[#3ba776] block mt-0.5">
                  Active Priority Order (+14% Bonus)
                </span>
              </div>
            </div>
          </div>

          {/* Bonus Breakdown & Transparent Calculation */}
          <BonusCard bonuses={calculatedBonuses} language={language} />
        </div>
      )}
    </div>
  );
};
