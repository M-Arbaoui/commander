import React, { useState, useMemo } from 'react';
import {
  PlayerDTO,
  Language,
  BuildMode,
  CostFactorsConfig,
  CompanyEngineSlot,
  GearPinSelection,
  GeneratedBuildCard,
  AppRoute,
  EquipmentSlot
} from '../types';
import { translations } from '../services/localization';
import { WarEraOptimizerService, GEAR_CATALOG_DATA, OptimizerInputs } from '../services/warEraOptimizer';
import { Badge } from '../components/Badge';
import { ItemIcon, ItemQuality } from '../components/ItemIcon';
import {
  Hammer,
  Shield,
  Coins,
  Zap,
  Swords,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RotateCcw,
  Sliders,
  Sparkles,
  Trophy,
  Factory,
  Briefcase,
  Crosshair,
  Percent,
  Check,
  Play,
  ArrowRight,
  Table as TableIcon,
  LayoutGrid,
  ExternalLink
} from 'lucide-react';

interface BuildViewProps {
  player: PlayerDTO;
  language: Language;
  onNavigateToCombatWithBuild?: (build: GeneratedBuildCard) => void;
  onSyncProfile?: () => void;
}

const getWeaponQuality = (weaponName: string): ItemQuality => {
  const lower = weaponName.toLowerCase();
  if (lower.includes('knife')) return 'grey';
  if (lower.includes('pistol') || lower.includes('gun')) return 'green';
  if (lower.includes('rifle') && !lower.includes('sniper')) return 'blue';
  if (lower.includes('sniper')) return 'purple';
  if (lower.includes('tank')) return 'gold';
  if (lower.includes('jet')) return 'red';
  return 'blue';
};

const getWeaponKey = (weaponName: string): string => {
  const lower = weaponName.toLowerCase();
  if (lower.includes('knife')) return 'knife';
  if (lower.includes('pistol') || lower.includes('gun')) return 'gun';
  if (lower.includes('rifle') && !lower.includes('sniper')) return 'rifle';
  if (lower.includes('sniper')) return 'sniper';
  if (lower.includes('tank')) return 'tank';
  if (lower.includes('jet')) return 'jet';
  return 'rifle';
};

const getArmorQuality = (armorName: string): ItemQuality => {
  const lower = armorName.toLowerCase();
  if (lower.includes('grey') || lower.includes('q1')) return 'grey';
  if (lower.includes('green') || lower.includes('q2')) return 'green';
  if (lower.includes('blue') || lower.includes('q3')) return 'blue';
  if (lower.includes('purple') || lower.includes('q4')) return 'purple';
  if (lower.includes('gold') || lower.includes('q5')) return 'gold';
  if (lower.includes('red') || lower.includes('mythic') || lower.includes('q6')) return 'red';
  return 'blue';
};

const getAmmoKey = (ammoStr: string): string => {
  const lower = ammoStr.toLowerCase();
  if (lower.includes('heavy')) return 'heavyAmmo';
  if (lower.includes('light')) return 'lightAmmo';
  return 'ammo';
};

export const BuildView: React.FC<BuildViewProps> = ({
  player,
  language,
  onNavigateToCombatWithBuild,
  onSyncProfile
}) => {
  const t = translations[language];

  // FAQ Accordion State
  const [showFaq, setShowFaq] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Input Sliders & Controls
  const [level, setLevel] = useState<number>(player.level || 25);
  const [prestigePoints, setPrestigePoints] = useState<number>(4);
  const [rankBonus, setRankBonus] = useState<number>((player.militaryRank || 1) * 0.25);
  const [battleBonus, setBattleBonus] = useState<number>(60);
  const [targetNetCost, setTargetNetCost] = useState<number>(0.0);
  const [targetNetAuto, setTargetNetAuto] = useState<boolean>(true);

  // Mode Selection
  const [currentMode, setCurrentMode] = useState<BuildMode>('soldier');

  // Cost Factors
  const [costFactors, setCostFactors] = useState<CostFactorsConfig>({
    cases: true,
    scrap: true,
    battleLoot: 'single',
    companies: true,
    work: true,
    employeeProfits: false
  });

  // Companies
  const [pinCompanies, setPinCompanies] = useState<boolean>(true);
  const [companies, setCompanies] = useState<CompanyEngineSlot[]>([
    { id: 1, tier: 4, name: 'Iron Refinery', dailyRevenue: 45, dailyMaintenance: 12 },
    { id: 2, tier: 3, name: 'Ammunition Plant', dailyRevenue: 38, dailyMaintenance: 10 },
    { id: 3, tier: 2, name: 'Synthetic Food Farm', dailyRevenue: 24, dailyMaintenance: 6 },
    { id: 4, tier: 0, name: 'Inactive Slot', dailyRevenue: 0, dailyMaintenance: 0 },
    { id: 5, tier: 0, name: 'Inactive Slot', dailyRevenue: 0, dailyMaintenance: 0 },
    { id: 6, tier: 0, name: 'Inactive Slot', dailyRevenue: 0, dailyMaintenance: 0 }
  ]);

  // Skill Pins
  const [pinnedSkills, setPinnedSkills] = useState<Record<string, number | 'any'>>({
    attack: 'any',
    precision: 'any',
    criticalChance: 'any',
    criticalDamage: 'any',
    armor: 'any',
    dodge: 'any',
    health: 'any',
    lootChance: 'any',
    hunger: 'any',
    entrepreneurship: 'any',
    energy: 'any',
    production: 'any',
    companiesLimit: 'any',
    management: 'any'
  });

  const [pinnedPrestige, setPinnedPrestige] = useState<Record<string, number>>({
    attack: 2,
    criticalDamage: 1,
    armor: 1
  });

  // Gear Pins
  const [pinnedGear, setPinnedGear] = useState<GearPinSelection>({
    weapon: 'any',
    helmet: 'any',
    chest: 'any',
    pants: 'any',
    boots: 'any',
    gloves: 'any',
    ammo: 'any',
    food: 'any',
    stim: true
  });

  // Other Pins
  const [tournamentSkill, setTournamentSkill] = useState<string>('attack');
  const [tournamentBonus, setTournamentBonus] = useState<number>(0);
  const [combatHours, setCombatHours] = useState<number>(18);

  // Status & Notification
  const [appliedBuildNotification, setAppliedBuildNotification] = useState<string | null>(null);

  // Build Results
  const optimizerInputs: OptimizerInputs = useMemo(() => {
    return {
      level,
      prestigePoints,
      rankBonusPercent: rankBonus,
      battleBonusPercent: battleBonus,
      targetNetCost,
      targetNetAuto,
      mode: currentMode,
      costFactors,
      companies,
      pinnedSkills,
      pinnedPrestige,
      pinnedGear,
      tournamentSkill: tournamentBonus > 0 ? tournamentSkill : undefined,
      tournamentBonus,
      combatHours
    };
  }, [
    level,
    prestigePoints,
    rankBonus,
    battleBonus,
    targetNetCost,
    targetNetAuto,
    currentMode,
    costFactors,
    companies,
    pinnedSkills,
    pinnedPrestige,
    pinnedGear,
    tournamentSkill,
    tournamentBonus,
    combatHours
  ]);

  const generatedBuilds = useMemo(() => {
    return WarEraOptimizerService.runOptimizer(optimizerInputs);
  }, [optimizerInputs]);

  // Skill Budget math
  const totalSpBudget = level * 4;
  const spentSp = Object.entries(pinnedSkills).reduce((sum, [, val]) => {
    return sum + (typeof val === 'number' ? val : 0);
  }, 0);

  const spentPp = Object.values(pinnedPrestige).reduce<number>((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

  const handleResetDefaults = () => {
    setPinnedSkills({
      attack: 'any',
      precision: 'any',
      criticalChance: 'any',
      criticalDamage: 'any',
      armor: 'any',
      dodge: 'any',
      health: 'any',
      lootChance: 'any',
      hunger: 'any',
      entrepreneurship: 'any',
      energy: 'any',
      production: 'any',
      companiesLimit: 'any',
      management: 'any'
    });
    setPinnedGear({
      weapon: 'any',
      helmet: 'any',
      chest: 'any',
      pants: 'any',
      boots: 'any',
      gloves: 'any',
      ammo: 'any',
      food: 'any',
      stim: true
    });
    setTournamentBonus(0);
    setTargetNetAuto(true);
    setTargetNetCost(0.0);
  };

  const currentGearTotalAtk = useMemo(() => {
    const slots: EquipmentSlot[] = ['weapon', 'helmet', 'chest', 'pants', 'boots', 'gloves'];
    return slots.reduce((acc, slot) => acc + (player.equipment?.[slot]?.attackBonus || 0), 0);
  }, [player.equipment]);

  const currentGearTotalArm = useMemo(() => {
    const slots: EquipmentSlot[] = ['weapon', 'helmet', 'chest', 'pants', 'boots', 'gloves'];
    return slots.reduce((acc, slot) => acc + (player.equipment?.[slot]?.armorBonus || 0), 0);
  }, [player.equipment]);

  const handleSkillLevelChange = (skillKey: string, valStr: string) => {
    setPinnedSkills((prev) => ({
      ...prev,
      [skillKey]: valStr === 'any' ? 'any' : parseInt(valStr, 10) || 0
    }));
  };

  const handlePrestigeStep = (skillKey: string, delta: number) => {
    setPinnedPrestige((prev) => {
      const current = prev[skillKey] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [skillKey]: next };
    });
  };

  const cycleCompanyTier = (slotId: number) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === slotId) {
          const nextTier = (c.tier + 1) % 8;
          return {
            ...c,
            tier: nextTier,
            dailyRevenue: nextTier === 0 ? 0 : nextTier * 14 + 10,
            dailyMaintenance: nextTier === 0 ? 0 : nextTier * 3 + 2
          };
        }
        return c;
      })
    );
  };

  const formatDamage = (dmg: number) => {
    if (dmg >= 1_000_000) {
      return (dmg / 1_000_000).toFixed(2) + 'M';
    }
    if (dmg >= 1_000) {
      return (dmg / 1_000).toFixed(1) + 'K';
    }
    return dmg.toString();
  };

  return (
    <div className="space-y-6 pb-16 text-slate-200">
      {/* Site Header Row matching intel.warera.wiki/builder */}
      <div className="bg-[#14161c] border border-[#262a36] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-amber-400 tracking-wide uppercase flex items-center gap-2">
                <Hammer className="w-6 h-6 text-amber-400" />
                Warera Build Tool
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                v0.25.4 Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-Objective Pareto Build Optimizer — Maximizing damage output, loot returns, and economic yields
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d212c] hover:bg-[#252b3a] border border-[#303648] text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>FAQ & Algorithm</span>
              {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d212c] hover:bg-[#252b3a] border border-[#303648] text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Reset all pins and settings to sensible defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Collapsible FAQ */}
        {showFaq && (
          <div className="mt-4 p-4 rounded-lg bg-[#0e1015] border border-[#232734] text-xs space-y-3 leading-relaxed text-slate-300">
            <h3 className="font-bold text-amber-400 text-sm">How this tool works</h3>
            <p>
              The build tool finds character builds under three modes: <strong>Soldier</strong> (max damage, min cost), <strong>Looter</strong> (max cases looted per day net of market value), and <strong>Tycoon</strong> (pure economic company and wage maximization without combat).
            </p>
            <p>
              <strong>The NSGA-II Algorithm:</strong> Evolving a multi-objective frontier from break-even (-0.10 /K) up to the maximum damage apex in stepped cost tiers. Net cost = gear durability + consumables (ammo, food, pill) - scrap resale - expected case income - battle loot - company engine income - work wages.
            </p>
          </div>
        )}

        {/* Profile Import Strip & Manual Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181b24] border border-[#2b3040]">
              {player.avatarUrl ? (
                <img src={player.avatarUrl} alt={player.username} className="w-6 h-6 rounded-full border border-amber-400/40" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                  {player.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-white">{player.username}</span>
              <span className="text-[11px] text-amber-400 font-mono">Lv.{player.level}</span>
              {onSyncProfile && (
                <button
                  onClick={onSyncProfile}
                  className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                >
                  Resync
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-medium text-slate-300">Manual mode</span>
              <div
                onClick={() => setIsManualMode(!isManualMode)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                  isManualMode ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Active Player Equipment Loadout Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#14161f] border border-[#2c3244]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {player.username}'s Active In-Game Loadout
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101217] text-slate-300 border border-[#2b3040]">
                Live Profile Gear
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Total Gear ATK: <strong className="text-amber-300 font-mono">+{currentGearTotalAtk}</strong></span>
              <span>•</span>
              <span>Total Gear ARM: <strong className="text-emerald-400 font-mono">+{currentGearTotalArm}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(['weapon', 'helmet', 'chest', 'pants', 'boots', 'gloves'] as EquipmentSlot[]).map((slot) => {
              const eq = player.equipment[slot];
              if (!eq) return null;
              return (
                <div
                  key={slot}
                  className="p-2 rounded-lg bg-[#181b24] border border-[#282d3d] flex items-center gap-2.5 hover:border-amber-400/40 transition-colors shadow-sm"
                  title={`${eq.name} (${eq.rarity})`}
                >
                  <ItemIcon
                    item={eq.id || eq.artworkCode || slot}
                    size="sm"
                    alt={eq.name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] uppercase font-bold text-slate-400 leading-tight truncate">
                      {slot}
                    </div>
                    <div className="text-xs font-bold text-white truncate leading-tight mt-0.5" title={eq.name}>
                      {eq.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                      {eq.attackBonus > 0
                        ? `+${eq.attackBonus} ATK`
                        : eq.armorBonus > 0
                        ? `+${eq.armorBonus} ARM`
                        : eq.dodgeBonus > 0
                        ? `+${(eq.dodgeBonus * 100).toFixed(0)}% DDG`
                        : `+${eq.precisionBonus} PRC`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 1: Sliders Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Level & Prestige */}
          <div className="p-3 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Level</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={level}
                  onChange={(e) => setLevel(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-12 px-1.5 py-0.5 text-center text-xs font-bold bg-[#101217] border border-[#353c4e] rounded text-white"
                />
                <span className="text-[11px] text-amber-400 font-semibold">PP:</span>
                <div className="flex items-center gap-1 bg-[#101217] border border-[#353c4e] rounded px-1.5 py-0.5">
                  <span className="text-xs font-bold text-amber-300">{prestigePoints}</span>
                  <div className="flex flex-col ml-1">
                    <button
                      onClick={() => setPrestigePoints((p) => Math.min(50, p + 1))}
                      className="text-[9px] leading-none text-slate-400 hover:text-white"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => setPrestigePoints((p) => Math.max(0, p - 1))}
                      className="text-[9px] leading-none text-slate-400 hover:text-white"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>SP Budget: {totalSpBudget}</span>
              <span>4 SP / Lv</span>
            </div>
          </div>

          {/* Rank Bonus % */}
          <div className="p-3 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Rank Bonus %</span>
              <input
                type="number"
                min={0}
                max={37.5}
                step={0.25}
                value={rankBonus}
                onChange={(e) => setRankBonus(parseFloat(e.target.value) || 0)}
                className="w-14 px-1.5 py-0.5 text-center text-xs font-bold bg-[#101217] border border-[#353c4e] rounded text-amber-300"
              />
            </div>
            <input
              type="range"
              min={0}
              max={37.5}
              step={0.25}
              value={rankBonus}
              onChange={(e) => setRankBonus(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-[10px] text-slate-400">Military Rank attack boost</div>
          </div>

          {/* Battle Bonus % */}
          <div className="p-3 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Battle Bonus %</span>
              <input
                type="number"
                min={0}
                max={135}
                step={1}
                value={battleBonus}
                onChange={(e) => setBattleBonus(parseFloat(e.target.value) || 0)}
                className="w-14 px-1.5 py-0.5 text-center text-xs font-bold bg-[#101217] border border-[#353c4e] rounded text-amber-300"
              />
            </div>
            <input
              type="range"
              min={0}
              max={135}
              step={1}
              value={battleBonus}
              onChange={(e) => setBattleBonus(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-[10px] text-slate-400">Alliances, orders & pacts</div>
          </div>

          {/* Target Net Cost /K */}
          <div className="p-3 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Target Net /K</span>
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={targetNetAuto}
                    onChange={(e) => setTargetNetAuto(e.target.checked)}
                    className="rounded border-slate-600 accent-amber-500"
                  />
                  <span>Auto</span>
                </label>
                {!targetNetAuto && (
                  <input
                    type="number"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={targetNetCost}
                    onChange={(e) => setTargetNetCost(parseFloat(e.target.value) || 0)}
                    className="w-14 px-1.5 py-0.5 text-center text-xs font-bold bg-[#101217] border border-[#353c4e] rounded text-amber-300"
                  />
                )}
              </div>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              disabled={targetNetAuto}
              value={targetNetCost}
              onChange={(e) => setTargetNetCost(parseFloat(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 ${
                targetNetAuto ? 'bg-slate-800 opacity-40' : 'bg-slate-700'
              }`}
            />
            <div className="text-[10px] text-slate-400">Coins spent per 1,000 damage</div>
          </div>
        </div>

        {/* Row 2: Cost Factors & Companies (Expanded in Manual Mode or shown cleanly) */}
        {isManualMode && (
          <div className="mt-5 pt-4 border-t border-[#232733] grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Cost Factors */}
            <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  Cost Factors
                </span>
                <span className="text-[10px] text-slate-400">Income sources crediting daily costs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={costFactors.cases}
                    onChange={(e) => setCostFactors({ ...costFactors, cases: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <ItemIcon item="case1" size="xs" showBorder={false} />
                  <span>Loot Cases</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={costFactors.scrap}
                    onChange={(e) => setCostFactors({ ...costFactors, scrap: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <ItemIcon item="scraps" size="xs" showBorder={false} />
                  <span>Gear Scrap</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={costFactors.companies}
                    onChange={(e) => setCostFactors({ ...costFactors, companies: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Companies Engine</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={costFactors.work}
                    onChange={(e) => setCostFactors({ ...costFactors, work: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Work & Self-Work</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={costFactors.employeeProfits}
                    onChange={(e) => setCostFactors({ ...costFactors, employeeProfits: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Employee Profits</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Battle Loot:</span>
                  <select
                    value={costFactors.battleLoot}
                    onChange={(e) => setCostFactors({ ...costFactors, battleLoot: e.target.value as any })}
                    className="text-xs bg-[#101217] border border-[#353c4e] rounded px-1.5 py-0.5 text-slate-200"
                  >
                    <option value="off">Off</option>
                    <option value="single">Single Battle</option>
                    <option value="average">Average Day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Companies Engine Manager */}
            <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5" />
                  Automated Engine Slots
                </span>
                <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinCompanies}
                    onChange={(e) => setPinCompanies(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>Pin to Companies Skill</span>
                </label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {companies.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => cycleCompanyTier(slot.id)}
                    className={`p-2 rounded border text-center transition-all ${
                      slot.tier > 0
                        ? 'bg-[#1e2330] border-amber-500/40 hover:border-amber-400'
                        : 'bg-[#101217] border-[#292f3d] text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400">Slot {slot.id}</div>
                    <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                      {slot.tier > 0 ? `Tier ${slot.tier}` : 'Inactive'}
                    </div>
                    {slot.tier > 0 && (
                      <div className="text-[9px] text-emerald-400 mt-0.5">
                        +{(slot.dailyRevenue - slot.dailyMaintenance)} $/d
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector Buttons matching intel.warera.wiki/builder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          <button
            onClick={() => setCurrentMode('soldier')}
            className={`p-4 rounded-xl border text-start transition-all relative ${
              currentMode === 'soldier'
                ? 'bg-gradient-to-r from-red-950/40 to-[#1f1b24] border-red-500/60 ring-1 ring-red-500/40 shadow-lg'
                : 'bg-[#161922] border-[#2b3040] hover:bg-[#1c202c]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-400" />
                Soldier Mode
              </span>
              {currentMode === 'soldier' && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
            </div>
            <div className="text-xs text-red-300 font-semibold mt-1">Max damage · min cost</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Finds optimal combat loadouts along the Pareto damage-to-cost efficiency frontier.
            </p>
          </button>

          <button
            onClick={() => setCurrentMode('looter')}
            className={`p-4 rounded-xl border text-start transition-all relative ${
              currentMode === 'looter'
                ? 'bg-gradient-to-r from-emerald-950/40 to-[#1b241e] border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-lg'
                : 'bg-[#161922] border-[#2b3040] hover:bg-[#1c202c]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Looter Mode
              </span>
              {currentMode === 'looter' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </div>
            <div className="text-xs text-emerald-300 font-semibold mt-1">Max $/day · case farming</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Optimizes for loot crates collected per day, crediting crate value directly against gear costs.
            </p>
          </button>

          <button
            onClick={() => setCurrentMode('tycoon')}
            className={`p-4 rounded-xl border text-start transition-all relative ${
              currentMode === 'tycoon'
                ? 'bg-gradient-to-r from-amber-950/40 to-[#24211b] border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg'
                : 'bg-[#161922] border-[#2b3040] hover:bg-[#1c202c]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Tycoon Mode
              </span>
              {currentMode === 'tycoon' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
            </div>
            <div className="text-xs text-amber-300 font-semibold mt-1">Max $/day · pure economy</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Zero combat. Directs all skill points into Entrepreneurship, Production & Company engines for maximum passive revenue.
            </p>
          </button>
        </div>
      </div>

      {/* Constraints Panel (3 columns: Pin Skills, Pin Gear, Other Pins) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Pin Skills (6 cols) */}
        <div className="lg:col-span-6 bg-[#14161c] border border-[#262a36] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pin Skills</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#1d212c] text-slate-300 border border-[#303648]">
                {spentSp} / {totalSpBudget} SP
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {spentPp} / {prestigePoints} PP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const unpinned: Record<string, number | 'any'> = {};
                  Object.keys(pinnedSkills).forEach((k) => (unpinned[k] = 'any'));
                  setPinnedSkills(unpinned);
                }}
                className="text-[10px] font-semibold text-slate-400 hover:text-white"
              >
                Clear Pins
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
            {[
              { key: 'attack', name: 'Attack', cat: 'Combat' },
              { key: 'precision', name: 'Precision', cat: 'Combat' },
              { key: 'criticalChance', name: 'Crit Chance', cat: 'Combat' },
              { key: 'criticalDamage', name: 'Crit Damage', cat: 'Combat' },
              { key: 'armor', name: 'Armor', cat: 'Combat' },
              { key: 'dodge', name: 'Dodge', cat: 'Combat' },
              { key: 'health', name: 'Health', cat: 'Combat' },
              { key: 'lootChance', name: 'Loot Chance', cat: 'Combat' },
              { key: 'hunger', name: 'Hunger Sustain', cat: 'Combat' },
              { key: 'entrepreneurship', name: 'Entrepreneurship', cat: 'Eco' },
              { key: 'energy', name: 'Energy Pool', cat: 'Eco' },
              { key: 'production', name: 'Production', cat: 'Eco' },
              { key: 'companiesLimit', name: 'Companies Cap', cat: 'Eco' },
              { key: 'management', name: 'Management', cat: 'Eco' }
            ].map((skill) => {
              const currentVal = pinnedSkills[skill.key];
              const prestigeVal = pinnedPrestige[skill.key] || 0;

              return (
                <div
                  key={skill.key}
                  className="p-2 rounded bg-[#181b24] border border-[#2b3040] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{skill.name}</div>
                    <div className="text-[10px] text-slate-500">{skill.cat}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={currentVal === 'any' ? 'any' : currentVal.toString()}
                      onChange={(e) => handleSkillLevelChange(skill.key, e.target.value)}
                      className="text-xs bg-[#101217] border border-[#353c4e] rounded px-1.5 py-0.5 text-amber-300 font-mono"
                    >
                      <option value="any">Any</option>
                      <option value="5">5</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                      <option value="80">80</option>
                    </select>

                    {/* Prestige stepper */}
                    <div className="flex items-center bg-[#101217] border border-[#353c4e] rounded px-1 py-0.5">
                      <span className="text-[10px] font-bold text-amber-400">+{prestigeVal}</span>
                      <div className="flex flex-col ml-1">
                        <button
                          onClick={() => handlePrestigeStep(skill.key, 1)}
                          className="text-[8px] leading-none text-slate-400 hover:text-white"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handlePrestigeStep(skill.key, -1)}
                          className="text-[8px] leading-none text-slate-400 hover:text-white"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Pin Gear & Consumables (4 cols) */}
        <div className="lg:col-span-4 bg-[#14161c] border border-[#262a36] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pin Gear & Consumables</span>
            <span className="text-[10px] text-slate-400">Lock specific loadout</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Weapon */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon
                  item={pinnedGear.weapon !== 'any' ? pinnedGear.weapon : 'rifle'}
                  quality={pinnedGear.weapon !== 'any' ? getWeaponQuality(pinnedGear.weapon) : 'none'}
                  size="xs"
                />
                <span className="font-semibold text-slate-300">Weapon</span>
              </div>
              <select
                value={pinnedGear.weapon}
                onChange={(e) => setPinnedGear({ ...pinnedGear, weapon: e.target.value })}
                className="text-xs bg-[#101217] border border-[#353c4e] rounded px-2 py-0.5 text-amber-300"
              >
                <option value="any">Any (Optimal)</option>
                <option value="knife">Combat Knife (Q1)</option>
                <option value="gun">Sidearm Pistol (Q2)</option>
                <option value="rifle">Assault Rifle (Q3)</option>
                <option value="sniper">Precision Rifle (Q4)</option>
                <option value="tank">Armored Vehicle (Q5)</option>
                <option value="jet">Stealth Jet (Q6)</option>
              </select>
            </div>

            {/* Helmet */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon
                  item="helmet"
                  quality={pinnedGear.helmet !== 'any' ? (pinnedGear.helmet as ItemQuality) : 'none'}
                  size="xs"
                />
                <span className="font-semibold text-slate-300">Helmet</span>
              </div>
              <select
                value={pinnedGear.helmet}
                onChange={(e) => setPinnedGear({ ...pinnedGear, helmet: e.target.value })}
                className="text-xs bg-[#101217] border border-[#353c4e] rounded px-2 py-0.5 text-amber-300"
              >
                <option value="any">Any</option>
                <option value="grey">Grey (Q1)</option>
                <option value="green">Green (Q2)</option>
                <option value="blue">Blue (Q3)</option>
                <option value="purple">Purple (Q4)</option>
                <option value="gold">Gold (Q5)</option>
                <option value="red">Mythic Red (Q6)</option>
              </select>
            </div>

            {/* Armor Chest */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon
                  item="chest"
                  quality={pinnedGear.chest !== 'any' ? (pinnedGear.chest as ItemQuality) : 'none'}
                  size="xs"
                />
                <span className="font-semibold text-slate-300">Armor Chest</span>
              </div>
              <select
                value={pinnedGear.chest}
                onChange={(e) => setPinnedGear({ ...pinnedGear, chest: e.target.value })}
                className="text-xs bg-[#101217] border border-[#353c4e] rounded px-2 py-0.5 text-amber-300"
              >
                <option value="any">Any</option>
                <option value="grey">Grey (Q1)</option>
                <option value="green">Green (Q2)</option>
                <option value="blue">Blue (Q3)</option>
                <option value="purple">Purple (Q4)</option>
                <option value="gold">Gold (Q5)</option>
                <option value="red">Mythic Red (Q6)</option>
              </select>
            </div>

            {/* Ammo */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon
                  item={pinnedGear.ammo === 'heavy' ? 'heavyAmmo' : pinnedGear.ammo === 'light' ? 'lightAmmo' : 'ammo'}
                  size="xs"
                />
                <span className="font-semibold text-slate-300">Ammunition</span>
              </div>
              <select
                value={pinnedGear.ammo}
                onChange={(e) => setPinnedGear({ ...pinnedGear, ammo: e.target.value })}
                className="text-xs bg-[#101217] border border-[#353c4e] rounded px-2 py-0.5 text-amber-300"
              >
                <option value="any">Any (Auto)</option>
                <option value="none">None (0%)</option>
                <option value="light">Light Ammo (+10%)</option>
                <option value="standard">Standard Ammo (+20%)</option>
                <option value="heavy">Heavy AP Ammo (+40%)</option>
              </select>
            </div>

            {/* Food */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon
                  item={pinnedGear.food === 'fish' ? 'cookedFish' : pinnedGear.food === 'steak' ? 'steak' : 'bread'}
                  size="xs"
                />
                <span className="font-semibold text-slate-300">Food Ration</span>
              </div>
              <select
                value={pinnedGear.food}
                onChange={(e) => setPinnedGear({ ...pinnedGear, food: e.target.value })}
                className="text-xs bg-[#101217] border border-[#353c4e] rounded px-2 py-0.5 text-amber-300"
              >
                <option value="any">Any (Auto)</option>
                <option value="none">No Food</option>
                <option value="bread">Bread (+10%)</option>
                <option value="steak">Steak (+20%)</option>
                <option value="fish">Cooked Fish (+30%)</option>
              </select>
            </div>

            {/* Stim Pill */}
            <div className="flex items-center justify-between p-2 rounded bg-[#181b24] border border-[#2b3040]">
              <div className="flex items-center gap-2">
                <ItemIcon item="cocain" quality={pinnedGear.stim ? 'gold' : 'none'} size="xs" />
                <span className="font-semibold text-slate-300">Combat Stim (+60% DMG)</span>
              </div>
              <input
                type="checkbox"
                checked={pinnedGear.stim}
                onChange={(e) => setPinnedGear({ ...pinnedGear, stim: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Column 3: Other Pins (2 cols) */}
        <div className="lg:col-span-2 bg-[#14161c] border border-[#262a36] rounded-xl p-4 space-y-4">
          <div className="pb-2 border-b border-[#232733]">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Other Pins</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Tournament Bonus</label>
              <select
                value={tournamentBonus}
                onChange={(e) => setTournamentBonus(parseInt(e.target.value))}
                className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-1.5 text-amber-300"
              >
                <option value={0}>None</option>
                <option value={1}>+1 (2nd Place)</option>
                <option value={3}>+3 (1st Place Champion)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Combat Hours</label>
              <input
                type="number"
                min={1}
                max={24}
                step={0.5}
                value={combatHours}
                onChange={(e) => setCombatHours(parseFloat(e.target.value) || 18)}
                className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-1.5 text-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 18h pilled / 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Notification */}
      {appliedBuildNotification && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{appliedBuildNotification}</span>
          </div>
          <button
            onClick={() => setAppliedBuildNotification(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Build Results Header & View Mode Switch */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Optimized Builds ({generatedBuilds.length})
          </h2>
          <p className="text-xs text-slate-400">
            Multi-objective Pareto solutions ranging from zero-cost sustainability to apex battle damage
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#14161c] border border-[#262a36] rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {generatedBuilds.map((build) => {
            const isGoldCard = build.isMaxDamage;

            return (
              <div
                key={build.id}
                className={`rounded-xl p-5 relative transition-all flex flex-col justify-between ${
                  isGoldCard
                    ? 'bg-gradient-to-b from-[#221c12] to-[#14161c] border-2 border-amber-400 ring-2 ring-amber-400/20 shadow-2xl'
                    : 'bg-[#14161c] border border-[#262a36] hover:border-slate-600'
                }`}
              >
                {/* Header Tag */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        isGoldCard
                          ? 'bg-amber-400 text-black font-black'
                          : 'bg-[#1f2430] text-amber-300 border border-[#30384a]'
                      }`}
                    >
                      {build.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      SP: {build.totalSpInvested} | PP: {build.totalPpInvested}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{build.name}</h3>

                  {/* Primary Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-[#202430]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Daily Damage</div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {build.dailyDamage > 0 ? formatDamage(build.dailyDamage) : '0 (Tycoon)'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-[#202430]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Net Cost / 1K DMG</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        {build.costPer1kDamage > 0 ? `${build.costPer1kDamage} $` : 'Free / Profit'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-[#202430]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Daily Net Cost</div>
                      <div className={`text-sm font-bold font-mono ${build.dailyNetCost < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {build.dailyNetCost} Coins / day
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-[#202430]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Cases / Day</div>
                      <div className="text-sm font-bold text-purple-300 font-mono">
                        {build.casesPerDay} crates
                      </div>
                    </div>
                  </div>

                  {/* Equipped Loadout Summary with authentic item logos */}
                  <div className="p-3 rounded-lg bg-[#181b24] border border-[#262c3b] mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400">Recommended Loadout</span>
                      <span className="text-[10px] text-slate-400 font-mono">In-Game Gear</span>
                    </div>

                    {/* Visual Item Badges Row - All 6 Gear Slots + Consumables */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                      <ItemIcon
                        item={build.gearSummary.weapon}
                        size="sm"
                        alt={`Weapon: ${build.gearSummary.weapon}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.helmet}
                        size="sm"
                        alt={`Helmet: ${build.gearSummary.helmet}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.chest}
                        size="sm"
                        alt={`Chest: ${build.gearSummary.chest}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.pants}
                        size="sm"
                        alt={`Pants: ${build.gearSummary.pants}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.boots}
                        size="sm"
                        alt={`Boots: ${build.gearSummary.boots}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.gloves}
                        size="sm"
                        alt={`Gloves: ${build.gearSummary.gloves}`}
                      />
                      <div className="w-px h-6 bg-[#2d3240] mx-0.5" />
                      <ItemIcon
                        item={build.gearSummary.ammo}
                        size="sm"
                        alt={`Ammunition: ${build.gearSummary.ammo}`}
                      />
                      <ItemIcon
                        item={build.gearSummary.food}
                        size="sm"
                        alt={`Food: ${build.gearSummary.food}`}
                      />
                      {build.gearSummary.stim && (
                        <ItemIcon
                          item="cocain"
                          quality="gold"
                          size="sm"
                          alt="Combat Stim (+60% DMG)"
                        />
                      )}
                    </div>

                    <div className="space-y-1 pt-1 border-t border-[#232733]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weapon:</span>
                        <span className="font-semibold text-white">{build.gearSummary.weapon}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Armor:</span>
                        <span className="font-semibold text-white">{build.gearSummary.chest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ammo & Food:</span>
                        <span className="font-semibold text-white">{build.gearSummary.ammo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Combat Stim:</span>
                        <span className={`font-semibold ${build.gearSummary.stim ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {build.gearSummary.stim ? '+60% Active' : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#232733] flex items-center gap-2">
                  {onNavigateToCombatWithBuild && (
                    <button
                      onClick={() => onNavigateToCombatWithBuild(build)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-1.5 transition-colors shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Simulate in Combat</span>
                    </button>
                  )}
                  <button
                    onClick={() => setAppliedBuildNotification(`Configured ${build.name} for active testing.`)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#1e2330] hover:bg-[#272d3e] text-slate-300 border border-[#30384c] transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparative Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#14161c] border border-[#262a36] rounded-xl overflow-x-auto shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#191d26] text-slate-400 uppercase text-[10px] font-bold border-b border-[#262b38]">
              <tr>
                <th className="p-3">Build Name</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Daily Damage</th>
                <th className="p-3">Net Cost / 1K</th>
                <th className="p-3">Daily Net ($)</th>
                <th className="p-3">Cases/Day</th>
                <th className="p-3">Weapon</th>
                <th className="p-3">Armor Tier</th>
                <th className="p-3">Ammo</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212633]">
              {generatedBuilds.map((build) => (
                <tr
                  key={build.id}
                  className={`hover:bg-[#1a1d26] transition-colors ${
                    build.isMaxDamage ? 'bg-amber-500/5 font-semibold text-white' : ''
                  }`}
                >
                  <td className="p-3 font-bold flex items-center gap-1.5">
                    {build.isMaxDamage && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{build.name}</span>
                  </td>
                  <td className="p-3 uppercase text-[10px] text-amber-400 font-bold">{build.mode}</td>
                  <td className="p-3 font-mono font-bold text-amber-300">{formatDamage(build.dailyDamage)}</td>
                  <td className="p-3 font-mono text-emerald-400">{build.costPer1kDamage} $</td>
                  <td className="p-3 font-mono">{build.dailyNetCost} $</td>
                  <td className="p-3 font-mono text-purple-300">{build.casesPerDay}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <ItemIcon
                        item={build.gearSummary.weapon}
                        size="xs"
                      />
                      <span>{build.gearSummary.weapon}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <ItemIcon
                        item={build.gearSummary.chest}
                        size="xs"
                      />
                      <span>{build.gearSummary.chest}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <ItemIcon
                        item={build.gearSummary.ammo}
                        size="xs"
                      />
                      <span>{build.gearSummary.ammo}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {onNavigateToCombatWithBuild && (
                      <button
                        onClick={() => onNavigateToCombatWithBuild(build)}
                        className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black inline-flex items-center gap-1"
                      >
                        Simulate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
