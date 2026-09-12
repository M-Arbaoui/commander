import React from 'react';
import { PlayerDTO, WarDTO, BuildObjective, Language, DecisionCardData, EquipmentSlot } from '../types';
import { translations } from '../services/localization';
import { RecommendationEngine } from '../services/recommendationEngine';
import { DecisionCard } from '../components/DecisionCard';
import { StatCard } from '../components/StatCard';
import { ItemIcon } from '../components/ItemIcon';
import {
  Coins,
  Zap,
  Heart,
  Shield,
  Flag,
  Swords,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  player: PlayerDTO;
  selectedWar: WarDTO | null;
  objective: BuildObjective;
  language: Language;
  onNavigateToWar: () => void;
  onNavigateToBuild: () => void;
  onNavigateToCombat?: () => void;
  onNavigateToEconomy: () => void;
  onNavigateToSuggestions?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  player,
  selectedWar,
  objective,
  language,
  onNavigateToWar,
  onNavigateToBuild,
  onNavigateToCombat,
  onNavigateToEconomy,
  onNavigateToSuggestions
}) => {
  const t = translations[language];
  const decisions = RecommendationEngine.generateHomeDecisions(player, selectedWar, objective);
  const unspentSP = player.unspentSkillPoints ?? 4;

  return (
    <div className="space-y-6 pb-12">
      {/* 0. Where to Start Right Now - Direct Guidance Banner */}
      <div className="bg-gradient-to-r from-[#1b1f2b] via-[#161822] to-[#12141a] border border-amber-500/50 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500 text-black tracking-wider">
                Start Here
              </span>
              <span className="text-xs text-amber-300/90 font-medium">
                Level {player.level} Custom Strategy Guide
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-white mt-1">
              {unspentSP > 0 ? `You have ${unspentSP} Unspent Skill Points to Allocate!` : 'Ready to Optimize Your Gear & Battle Routine'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Skip confusing simulator tables. Get straight-to-the-point suggestions for which skill points to upgrade next, what weapons to craft, and how to spend your daily energy.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToSuggestions}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>View Suggestions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f2]">
          {t.decisionCenterTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#8e929b] mt-0.5">
          {t.decisionCenterSubtitle}
        </p>
      </div>

      {/* 1. Account Summary Bar */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#23262f] mb-3">
          <div className="flex items-center gap-3">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.username}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover border border-[#c5a059]/50 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-[#111215] border border-[#c5a059]/40 flex items-center justify-center font-bold text-[#c5a059]">
                {player.username.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#f4f4f2]">{player.username}</span>
                <span className="text-xs px-2 py-0.2 rounded bg-[#22252c] text-[#c5a059] font-mono border border-[#2c303a]">
                  {t.level} {player.level}
                </span>
                {player.militaryRank && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#111215] text-[#3ba776] border border-[#3ba776]/30 font-mono">
                    Rank {player.militaryRank}
                  </span>
                )}
                {player.activeBuff && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                    {player.activeBuff}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8e929b] mt-0.5">
                <span className="flex items-center gap-1 font-medium text-[#d4d6db]">
                  <Flag className="w-3 h-3 text-[#8e929b]" />
                  {player.country} ({player.countryCode})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-[#c5a059]">
                  <Shield className="w-3 h-3 text-[#3ba776]" />
                  {player.militaryUnit}
                </span>
                {player.totalDamages && (
                  <>
                    <span>•</span>
                    <span className="text-[11px] text-[#8e929b] font-mono">
                      {player.totalDamages.toLocaleString()} Total DMG
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#8e929b] flex items-center gap-1.5 bg-[#111215] px-3 py-1.5 rounded-lg border border-[#23262f]">
            <span className="w-2 h-2 rounded-full bg-[#3ba776] animate-pulse"></span>
            <span className="text-[#3ba776] font-medium">{player.lastFetchedAt ? `Live API (${player.lastFetchedAt})` : t.publicDataNotice}</span>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label={t.coins}
            value={player.coins.toLocaleString()}
            subtext="Liquid treasury"
            icon={<Coins className="w-4 h-4 text-[#c5a059]" />}
            variant="gold"
          />
          <StatCard
            label={t.energy}
            value={`${player.energy}/${player.maxEnergy}`}
            subtext="Available combat energy"
            icon={<Zap className="w-4 h-4 text-[#d99b38]" />}
          />
          <StatCard
            label={t.health}
            value={`${player.health}%`}
            subtext="Ready for battle"
            icon={<Heart className="w-4 h-4 text-[#c94a4a]" />}
          />
          <StatCard
            label="Total Combat Damage"
            value={player.totalDamages ? `${(player.totalDamages / 1000000).toFixed(1)}M` : '34.8M'}
            subtext="Lifetime dealt damage"
            icon={<TrendingUp className="w-4 h-4 text-[#3ba776]" />}
            variant="emerald"
          />
        </div>

        {/* Active Equipped Gear Arsenal */}
        <div className="mt-4 pt-4 border-t border-[#23262f]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f4f4f2] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                Active Equipped Gear
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111215] text-[#3ba776] border border-[#3ba776]/30">
                6 / 6 Equipped
              </span>
            </div>
            <button
              onClick={onNavigateToBuild}
              className="text-xs font-semibold text-[#c5a059] hover:text-[#d4b068] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Build Optimizer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {(['weapon', 'helmet', 'chest', 'pants', 'boots', 'gloves'] as EquipmentSlot[]).map((slot) => {
              const item = player.equipment[slot];
              const slotName = slot.toUpperCase();
              if (!item) {
                return (
                  <div key={slot} className="p-2.5 rounded-lg bg-[#121418] border border-[#23262f] flex flex-col items-center text-center">
                    <ItemIcon item={slot} size="md" />
                    <span className="text-[9px] uppercase font-bold text-[#8e929b] tracking-wider mt-1.5">{slotName}</span>
                    <span className="text-[10px] text-slate-500">Empty</span>
                  </div>
                );
              }

              const primaryStat =
                item.attackBonus > 0
                  ? `+${item.attackBonus} ATK`
                  : item.armorBonus > 0
                  ? `+${item.armorBonus} ARM`
                  : item.dodgeBonus > 0
                  ? `+${(item.dodgeBonus * 100).toFixed(0)}% DDG`
                  : `+${item.precisionBonus} PRC`;

              return (
                <div
                  key={slot}
                  onClick={onNavigateToBuild}
                  className="p-2.5 rounded-lg bg-[#14161d] hover:bg-[#1a1d26] border border-[#2c303d] hover:border-[#c5a059]/60 transition-all cursor-pointer flex flex-col items-center text-center group shadow-sm"
                  title={`${item.name} (${item.rarity}) - Click to inspect in Build Tool`}
                >
                  <ItemIcon
                    item={item.id || item.artworkCode || slot}
                    size="md"
                    alt={item.name}
                  />
                  <span className="text-[9px] uppercase font-bold text-[#8e929b] tracking-wider mt-1.5">{slotName}</span>
                  <span className="text-xs font-bold text-white truncate w-full mt-0.5 group-hover:text-[#c5a059] transition-colors" title={item.name}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0e1014] text-[#c5a059] border border-[#2c303a]">
                      T{item.level}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 font-mono">
                      {primaryStat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Launchers for Smart Suggestions & Build Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div
            onClick={onNavigateToSuggestions || onNavigateToBuild}
            className="p-4 rounded-xl bg-gradient-to-r from-[#1f2216] via-[#1a1e1d] to-[#14161c] border border-amber-500/50 hover:border-amber-400 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Smart Suggestions & Guidance
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Level-Tailored
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Clear, step-by-step suggestions: where to spend your skill points, which weapons to craft, and daily routines without simulator confusion.
            </p>
            <div className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Personalized Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={onNavigateToBuild}
            className="p-4 rounded-xl bg-gradient-to-r from-[#181d28] to-[#14161c] border border-blue-500/40 hover:border-blue-400 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Equipment & Build Catalog
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Gear Comparison
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Browse equipment tiers, consumable costs (ammo, food, stims), and stat breakdowns for Soldier, Looter, and Tycoon setups.
            </p>
            <div className="mt-3 text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Build Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current War Briefing */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-semibold text-[#f4f4f2]">{t.currentWarSummary}</h3>
          </div>
          <button
            type="button"
            onClick={onNavigateToWar}
            className="text-xs text-[#c5a059] hover:text-[#d4af37] flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Inspect All Wars</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {selectedWar ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-[#111215] border border-[#23262f]">
            <div className="md:col-span-2">
              <div className="text-xs text-[#8e929b] mb-1">Active Battlefront</div>
              <div className="font-bold text-sm text-[#f4f4f2]">{selectedWar.title}</div>
              <div className="text-xs text-[#8e929b] mt-1 flex items-center gap-2">
                <span>{selectedWar.attackerCountry} ({selectedWar.attackerCountryCode})</span>
                <span className="text-[#c5a059] font-bold">vs</span>
                <span>{selectedWar.defenderCountry} ({selectedWar.defenderCountryCode})</span>
                <span className="px-1.5 py-0.2 rounded bg-[#22252c] text-[#3ba776] text-[10px]">
                  Round {selectedWar.currentRound} ({selectedWar.timeRemainingMinutes}m left)
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs text-[#8e929b] mb-1">{t.currentBonus}</div>
              <div className="text-base font-bold text-[#c5a059]">
                +{Math.round((selectedWar.bonuses.totalMultiplier - 1) * 100)}%
              </div>
              <div className="text-[11px] text-[#8e929b] font-mono mt-0.5">
                {selectedWar.bonuses.totalMultiplier}x compounded
              </div>
            </div>

            <div>
              <div className="text-xs text-[#8e929b] mb-1">{t.estimatedDamage}</div>
              <div className="text-base font-bold text-[#3ba776]">
                {selectedWar.estimatedTotalDamage.toLocaleString()} DMG
              </div>
              <div className="text-[11px] text-[#8e929b] mt-0.5">
                Cost: ~{selectedWar.estimatedCoinsCost} coins
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#111215] border border-[#23262f] flex items-center justify-between">
            <span className="text-xs text-[#8e929b]">{t.noActiveWarSelected}</span>
            <button
              type="button"
              onClick={onNavigateToWar}
              className="text-xs font-semibold px-3 py-1.5 bg-[#22252c] hover:bg-[#2c303a] text-[#c5a059] rounded-md border border-[#c5a059]/30 cursor-pointer"
            >
              {t.selectWarPrompt}
            </button>
          </div>
        )}
      </div>

      {/* 3. Primary Recommendation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
            {t.primaryDecision}
          </span>
          <span className="text-xs text-[#8e929b]">Objective: {t.objectives[objective].label}</span>
        </div>
        <DecisionCard
          decision={decisions.primary}
          language={language}
          isPrimary={true}
          onAction={() => onNavigateToBuild()}
        />
      </div>

      {/* 4. Follow-up Recommendations (Up to 3) */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8e929b]">
          {t.followUpDecisions}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {decisions.followUps.map((dec) => (
            <DecisionCard
              key={dec.id}
              decision={dec}
              language={language}
              onAction={(d) => {
                if (d.category === 'economy') onNavigateToEconomy();
                else if (d.category === 'war') onNavigateToWar();
                else onNavigateToBuild();
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Avoid For Now Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-[#c94a4a]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c94a4a]">
            {t.avoidForNow}
          </h3>
        </div>
        <p className="text-xs text-[#8e929b]">
          Actions with poor efficiency, unjustified reset fees, or premature capital lockup under current build conditions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decisions.avoid.map((dec) => (
            <DecisionCard
              key={dec.id}
              decision={dec}
              language={language}
              onAction={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
