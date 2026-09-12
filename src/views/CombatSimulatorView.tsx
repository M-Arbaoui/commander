import React, { useState, useMemo } from 'react';
import {
  PlayerDTO,
  Language,
  CombatRoundLog,
  CombatSimulationSummary,
  GeneratedBuildCard,
  PlayerSkills
} from '../types';
import { translations } from '../services/localization';
import {
  CombatSimulatorEngine,
  CombatAttackerSetup,
  CombatDefenderSetup,
  PresetArchetype
} from '../services/combatSimulatorEngine';
import { GEAR_CATALOG_DATA } from '../services/warEraOptimizer';
import { ItemIcon, ItemQuality } from '../components/ItemIcon';
import {
  Swords,
  Shield,
  Zap,
  Target,
  Flame,
  Award,
  Crosshair,
  RotateCcw,
  Play,
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
  Heart,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CombatSimulatorViewProps {
  player: PlayerDTO;
  language: Language;
  preloadedBuild?: GeneratedBuildCard | null;
}

const getWeaponQuality = (weaponKey: string): ItemQuality => {
  switch (weaponKey) {
    case 'knife': return 'grey';
    case 'gun': return 'green';
    case 'rifle': return 'blue';
    case 'sniper': return 'purple';
    case 'tank': return 'gold';
    case 'jet': return 'red';
    default: return 'none';
  }
};

const getAmmoKey = (ammoKey: string): string => {
  switch (ammoKey) {
    case 'light': return 'lightAmmo';
    case 'heavy': return 'heavyAmmo';
    case 'standard': return 'ammo';
    default: return 'ammo';
  }
};

const getFoodKey = (foodKey: string): string => {
  switch (foodKey) {
    case 'fish': return 'cookedFish';
    case 'steak': return 'steak';
    default: return 'bread';
  }
};

export const CombatSimulatorView: React.FC<CombatSimulatorViewProps> = ({
  player,
  language,
  preloadedBuild
}) => {
  const t = translations[language];

  // Active Subtab
  const [activeTab, setActiveTab] = useState<'battle' | 'armory' | 'skills' | 'presets'>('battle');

  // Attacker Loadout State (Initialized from preloadedBuild or player)
  const [attackerSetup, setAttackerSetup] = useState<CombatAttackerSetup>(() => {
    if (preloadedBuild) {
      return {
        level: player.level,
        militaryRankBonus: (player.militaryRank || 1) * 0.25,
        battleBonus: 60.0,
        skills: { ...preloadedBuild.skills },
        gear: {
          weapon: Object.keys(GEAR_CATALOG_DATA.weapon).find(
            (k) => (GEAR_CATALOG_DATA.weapon as any)[k].name === preloadedBuild.gearSummary.weapon
          ) || 'rifle',
          helmet: 'blue',
          chest: 'blue',
          pants: 'blue',
          boots: 'blue',
          gloves: 'blue',
          ammo: 'standard',
          food: 'steak',
          stim: preloadedBuild.gearSummary.stim
        }
      };
    }
    return CombatSimulatorEngine.buildSetupFromPlayer(player);
  });

  // Defender Target State
  const [defenderSetup, setDefenderSetup] = useState<CombatDefenderSetup>({
    name: 'Frontline Battle Defender',
    armor: 45,
    dodge: 12,
    health: 25000
  });

  // Simulation Simulation State
  const [simulatedRoundsCount, setSimulatedRoundsCount] = useState<number>(50);
  const [combatLogs, setCombatLogs] = useState<CombatRoundLog[]>([]);
  const [combatSummary, setCombatSummary] = useState<CombatSimulationSummary | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Run simulation
  const handleRunSimulation = (rounds: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = CombatSimulatorEngine.simulateRounds(attackerSetup, defenderSetup, rounds);
      setCombatLogs(result.logs);
      setCombatSummary(result.summary);
      setIsSimulating(false);
    }, 150);
  };

  // Run initial simulation if not yet run
  useMemo(() => {
    if (!combatSummary) {
      const result = CombatSimulatorEngine.simulateRounds(attackerSetup, defenderSetup, 50);
      setCombatLogs(result.logs);
      setCombatSummary(result.summary);
    }
  }, []);

  const handleApplyPreset = (preset: PresetArchetype) => {
    setAttackerSetup(preset.setup);
    const result = CombatSimulatorEngine.simulateRounds(preset.setup, defenderSetup, 50);
    setCombatLogs(result.logs);
    setCombatSummary(result.summary);
    setActiveTab('battle');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6 pb-16 text-slate-200">
      {/* Top Protocol Header */}
      <div className="bg-[#14161c] border border-[#262a36] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-amber-400 tracking-wide uppercase flex items-center gap-2">
                <Swords className="w-6 h-6 text-amber-400" />
                Combat Simulator & Armory Optimizer
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                Battle Engine 0.25.4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Round-by-round combat battle mechanics, soft-capped armor calculations, DPE (Damage Per Energy), and durability loss analysis
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-[#101217] border border-[#262a36] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('battle')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'battle'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>War Room</span>
            </button>
            <button
              onClick={() => setActiveTab('armory')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'armory'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Armory Loadout</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'skills'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Skills Allocator</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>
        </div>

        {/* Preloaded build notification */}
        {preloadedBuild && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Preloaded configuration from Build Tool: <strong>{preloadedBuild.name}</strong></span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
              Target: {preloadedBuild.costPer1kDamage} $/K
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: BATTLE WAR ROOM */}
      {activeTab === 'battle' && (
        <div className="space-y-6">
          {/* Target & Attacker Configuration Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attacker Panel (6 cols) */}
            <div className="lg:col-span-6 bg-[#14161c] border border-[#262a36] rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Attacker Parameters</span>
                </div>
                <span className="text-xs text-amber-400 font-mono">Lv.{attackerSetup.level} Profile</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040]">
                  <span className="text-[10px] text-slate-400 uppercase block">Rank Bonus</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">+{attackerSetup.militaryRankBonus}%</span>
                </div>
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040]">
                  <span className="text-[10px] text-slate-400 uppercase block">Battle Bonus</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">+{attackerSetup.battleBonus}%</span>
                </div>
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040] flex items-center gap-2">
                  <ItemIcon
                    item={attackerSetup.gear.weapon}
                    quality={getWeaponQuality(attackerSetup.gear.weapon)}
                    size="xs"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Weapon</span>
                    <span className="text-xs font-semibold text-white capitalize">{attackerSetup.gear.weapon}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040] flex items-center gap-2">
                  <ItemIcon
                    item="cocain"
                    quality={attackerSetup.gear.stim ? 'gold' : 'none'}
                    size="xs"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Stim (+60%)</span>
                    <span className={`text-xs font-bold ${attackerSetup.gear.stim ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {attackerSetup.gear.stim ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Equipped Protocol Gear Strip */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1015] border border-[#232734]">
                <div className="flex items-center gap-1.5">
                  <ItemIcon item={attackerSetup.gear.weapon} quality={getWeaponQuality(attackerSetup.gear.weapon)} size="xs" alt="Weapon" />
                  <ItemIcon item="helmet" quality={attackerSetup.gear.helmet as ItemQuality} size="xs" alt="Helmet" />
                  <ItemIcon item="chest" quality={attackerSetup.gear.chest as ItemQuality} size="xs" alt="Chest" />
                  <ItemIcon item="pants" quality={attackerSetup.gear.pants as ItemQuality} size="xs" alt="Pants" />
                  <ItemIcon item="boots" quality={attackerSetup.gear.boots as ItemQuality} size="xs" alt="Boots" />
                  <ItemIcon item="gloves" quality={attackerSetup.gear.gloves as ItemQuality} size="xs" alt="Gloves" />
                  <ItemIcon item={getAmmoKey(attackerSetup.gear.ammo)} size="xs" alt="Ammo" />
                  <ItemIcon item={getFoodKey(attackerSetup.gear.food)} size="xs" alt="Food" />
                  {attackerSetup.gear.stim && <ItemIcon item="cocain" quality="gold" size="xs" alt="Stim" />}
                </div>
                <button
                  onClick={() => setActiveTab('armory')}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Configure Armory →
                </button>
              </div>

              {/* Sliders for fast combat testing */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Battle Bonus %</span>
                  <span className="text-amber-300 font-bold">{attackerSetup.battleBonus}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={135}
                  value={attackerSetup.battleBonus}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setAttackerSetup({ ...attackerSetup, battleBonus: val });
                  }}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Defender Target Panel (6 cols) */}
            <div className="lg:col-span-6 bg-[#14161c] border border-[#262a36] rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Enemy Defender Setup</span>
                </div>
                <span className="text-xs text-cyan-400 font-mono">Opponent Target</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040]">
                  <span className="text-[10px] text-slate-400 uppercase block">Defender Armor</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{defenderSetup.armor}</span>
                </div>
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040]">
                  <span className="text-[10px] text-slate-400 uppercase block">Defender Dodge</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{defenderSetup.dodge}%</span>
                </div>
                <div className="p-2.5 rounded bg-[#181b24] border border-[#2b3040]">
                  <span className="text-[10px] text-slate-400 uppercase block">Health Pool</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{formatNumber(defenderSetup.health)}</span>
                </div>
              </div>

              {/* Defender Sliders */}
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Target Armor Mitigation</span>
                    <span className="font-bold text-cyan-300 font-mono">{defenderSetup.armor} Armor</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={180}
                    value={defenderSetup.armor}
                    onChange={(e) => setDefenderSetup({ ...defenderSetup, armor: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Target Dodge Chance</span>
                    <span className="font-bold text-cyan-300 font-mono">{defenderSetup.dodge}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={defenderSetup.dodge}
                    onChange={(e) => setDefenderSetup({ ...defenderSetup, dodge: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Action Bar */}
          <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Execute Battle Run:</span>
              <div className="flex items-center gap-2">
                {[20, 50, 100].map((rounds) => (
                  <button
                    key={rounds}
                    onClick={() => {
                      setSimulatedRoundsCount(rounds);
                      handleRunSimulation(rounds);
                    }}
                    disabled={isSimulating}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      simulatedRoundsCount === rounds
                        ? 'bg-amber-500 text-black font-extrabold shadow'
                        : 'bg-[#1e2330] text-slate-300 hover:bg-[#272d3e] border border-[#30384a]'
                    }`}
                  >
                    {rounds} Rounds
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRunSimulation(simulatedRoundsCount)}
              disabled={isSimulating}
              className="px-5 py-2 rounded-lg text-xs font-extrabold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Battle Engine'}</span>
            </button>
          </div>

          {/* Simulation Results Dashboard */}
          {combatSummary && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Battle Damage</span>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {formatNumber(combatSummary.totalDamage)}
                </div>
                <span className="text-[10px] text-slate-500">{combatSummary.simulatedRounds} rounds completed</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Avg Damage / Hit</span>
                <div className="text-lg font-black text-white font-mono">
                  {formatNumber(combatSummary.avgDamagePerHit)}
                </div>
                <span className="text-[10px] text-slate-500">Includes armor reduction</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">DPE (Per 100 Energy)</span>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {formatNumber(combatSummary.damagePer100Energy)}
                </div>
                <span className="text-[10px] text-slate-500">Damage efficiency</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Net Cost / 1K DMG</span>
                <div className="text-lg font-black text-cyan-400 font-mono">
                  {combatSummary.netCostPer1kDamage} $
                </div>
                <span className="text-[10px] text-slate-500">Durability + Ammo burn</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Critical Hit Rate</span>
                <div className="text-lg font-black text-purple-400 font-mono">
                  {combatSummary.critRateActual}%
                </div>
                <span className="text-[10px] text-slate-500">Hit Rate: {combatSummary.hitRateActual}%</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161c] border border-[#262a36] space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Projected Daily DMG</span>
                <div className="text-lg font-black text-amber-300 font-mono">
                  {formatNumber(combatSummary.projectedDailyDamage)}
                </div>
                <span className="text-[10px] text-slate-500">~{combatSummary.expectedDailyCases} Cases / day</span>
              </div>
            </div>
          )}

          {/* Live Combat Log Console */}
          <div className="bg-[#14161c] border border-[#262a36] rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Live Round-by-Round Combat Log
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Showing {combatLogs.length} events
              </span>
            </div>

            <div className="h-64 overflow-y-auto space-y-1.5 pr-2 font-mono text-xs scrollbar-thin">
              {combatLogs.map((log) => {
                const isCrit = log.outcome === 'CRIT';
                const isDodge = log.outcome === 'DODGE';

                return (
                  <div
                    key={log.round}
                    className={`p-2 rounded border flex items-center justify-between ${
                      isCrit
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : isDodge
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : 'bg-[#101217] border-[#222734] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-[#1b1f2b] text-slate-400">
                        R{log.round}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                          isCrit
                            ? 'bg-amber-400 text-black font-black'
                            : isDodge
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {log.outcome}
                      </span>
                      <span className="text-xs">{log.logMessage}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Remaining HP: {formatNumber(log.enemyHealthRemaining)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARMORY & LOADOUT */}
      {activeTab === 'armory' && (
        <div className="space-y-6">
          <div className="bg-[#14161c] border border-[#262a36] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
              <div>
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Armory Protocol Loadout</h3>
                <p className="text-xs text-slate-400">Equip weapon, armor pieces, ammo and consumables with live in-game assets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Weapon */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item={attackerSetup.gear.weapon}
                    quality={getWeaponQuality(attackerSetup.gear.weapon)}
                    size="md"
                    alt={attackerSetup.gear.weapon}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Weapon</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.weapon} ({getWeaponQuality(attackerSetup.gear.weapon).toUpperCase()})
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.weapon}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, weapon: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="knife">Combat Knife (Q1) — ATK 31</option>
                  <option value="gun">Sidearm Pistol (Q2) — ATK 56</option>
                  <option value="rifle">Assault Rifle (Q3) — ATK 81</option>
                  <option value="sniper">Precision Rifle (Q4) — ATK 116</option>
                  <option value="tank">Armored Vehicle (Q5) — ATK 161</option>
                  <option value="jet">Stealth Jet (Q6) — ATK 261</option>
                </select>
              </div>

              {/* Helmet */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="helmet"
                    quality={attackerSetup.gear.helmet as ItemQuality}
                    size="md"
                    alt="Helmet"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Helmet</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.helmet} Quality
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.helmet}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, helmet: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="grey">Grey Cap (Q1)</option>
                  <option value="green">Green Helmet (Q2)</option>
                  <option value="blue">Blue Tactical (Q3)</option>
                  <option value="purple">Purple Spec (Q4)</option>
                  <option value="gold">Gold Ballistic (Q5)</option>
                  <option value="red">Mythic Red (Q6)</option>
                </select>
              </div>

              {/* Armor Chest */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="chest"
                    quality={attackerSetup.gear.chest as ItemQuality}
                    size="md"
                    alt="Armor Chest"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Armor Chest</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.chest} Quality
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.chest}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, chest: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="grey">Grey Vest (Q1)</option>
                  <option value="green">Green Vest (Q2)</option>
                  <option value="blue">Blue Plated (Q3)</option>
                  <option value="purple">Purple Cuirass (Q4)</option>
                  <option value="gold">Gold Heavy Armor (Q5)</option>
                  <option value="red">Mythic Exoskeleton (Q6)</option>
                </select>
              </div>

              {/* Pants */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="pants"
                    quality={attackerSetup.gear.pants as ItemQuality}
                    size="md"
                    alt="Combat Pants"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Combat Pants</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.pants} Quality
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.pants}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, pants: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="grey">Grey Utility Pants (Q1)</option>
                  <option value="green">Green Combat Pants (Q2)</option>
                  <option value="blue">Blue Tactical Pants (Q3)</option>
                  <option value="purple">Purple Spec Pants (Q4)</option>
                  <option value="gold">Gold Reinforced Greaves (Q5)</option>
                  <option value="red">Mythic Power Greaves (Q6)</option>
                </select>
              </div>

              {/* Boots */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="boots"
                    quality={attackerSetup.gear.boots as ItemQuality}
                    size="md"
                    alt="Combat Boots"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Combat Boots</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.boots} Quality
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.boots}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, boots: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="grey">Grey Work Boots (Q1)</option>
                  <option value="green">Green Combat Boots (Q2)</option>
                  <option value="blue">Blue Assault Boots (Q3)</option>
                  <option value="purple">Purple Spec Boots (Q4)</option>
                  <option value="gold">Gold Heavy Sabatons (Q5)</option>
                  <option value="red">Mythic Jet Sabatons (Q6)</option>
                </select>
              </div>

              {/* Gloves */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="gloves"
                    quality={attackerSetup.gear.gloves as ItemQuality}
                    size="md"
                    alt="Tactical Gloves"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Tactical Gloves</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.gloves} Quality
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.gloves}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, gloves: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="grey">Grey Grip Gloves (Q1)</option>
                  <option value="green">Green Combat Gloves (Q2)</option>
                  <option value="blue">Blue Plated Gauntlets (Q3)</option>
                  <option value="purple">Purple Sniper Gloves (Q4)</option>
                  <option value="gold">Gold Power Gauntlets (Q5)</option>
                  <option value="red">Mythic Exoskeleton Gauntlets (Q6)</option>
                </select>
              </div>

              {/* Ammo */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item={getAmmoKey(attackerSetup.gear.ammo)}
                    size="md"
                    alt="Ammunition"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Ammunition</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.ammo} Tier
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.ammo}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, ammo: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="none">None (0% bonus)</option>
                  <option value="light">Light Ammo (+10% DMG)</option>
                  <option value="standard">Standard Ammo (+20% DMG)</option>
                  <option value="heavy">Heavy AP Ammo (+40% DMG)</option>
                </select>
              </div>

              {/* Food */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-2">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item={getFoodKey(attackerSetup.gear.food)}
                    size="md"
                    alt="Food Ration"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Food Ration</span>
                    <span className="text-[10px] text-amber-400 capitalize font-mono">
                      {attackerSetup.gear.food} Provision
                    </span>
                  </div>
                </div>
                <select
                  value={attackerSetup.gear.food}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, food: e.target.value }
                    })
                  }
                  className="w-full text-xs bg-[#101217] border border-[#353c4e] rounded p-2 text-amber-300 font-semibold"
                >
                  <option value="none">No Food</option>
                  <option value="bread">Bread (+10% Regen)</option>
                  <option value="steak">Steak (+20% Regen)</option>
                  <option value="fish">Cooked Fish (+30% Regen)</option>
                </select>
              </div>

              {/* Stim */}
              <div className="p-3.5 rounded-lg bg-[#181b24] border border-[#2b3040] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ItemIcon
                    item="cocain"
                    quality={attackerSetup.gear.stim ? 'gold' : 'none'}
                    size="md"
                    alt="Combat Stim Pill"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Combat Stim Pill</span>
                    <span className="text-[10px] text-amber-400">+60% Flat Damage Boost</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={attackerSetup.gear.stim}
                  onChange={(e) =>
                    setAttackerSetup({
                      ...attackerSetup,
                      gear: { ...attackerSetup.gear, stim: e.target.checked }
                    })
                  }
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS ALLOCATOR */}
      {activeTab === 'skills' && (
        <div className="bg-[#14161c] border border-[#262a36] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
            <div>
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Combat Skills Allocator</h3>
              <p className="text-xs text-slate-400">Directly fine-tune skill investment to benchmark damage shifts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'attack', label: 'Attack', desc: 'Direct base power' },
              { key: 'precision', label: 'Precision', desc: 'Counters enemy dodge' },
              { key: 'criticalChance', label: 'Crit Chance', desc: '% chance for critical' },
              { key: 'criticalDamage', label: 'Crit Damage', desc: 'Bonus damage multiplier' },
              { key: 'armor', label: 'Armor', desc: 'Mitigates incoming damage' },
              { key: 'dodge', label: 'Dodge', desc: 'Evades incoming attacks' },
              { key: 'health', label: 'Health', desc: 'Max HP capacity' },
              { key: 'lootChance', label: 'Loot Chance', desc: 'Crate drop frequency' }
            ].map((skill) => {
              const val = (attackerSetup.skills as any)[skill.key] || 0;

              return (
                <div key={skill.key} className="p-3 rounded-lg bg-[#181b24] border border-[#2b3040] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{skill.label}</span>
                    <span className="font-bold text-amber-300 font-mono">{val}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    value={val}
                    onChange={(e) => {
                      const newSkills = { ...attackerSetup.skills, [skill.key]: parseInt(e.target.value) };
                      setAttackerSetup({ ...attackerSetup, skills: newSkills });
                    }}
                    className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="text-[10px] text-slate-500">{skill.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRESETS */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CombatSimulatorEngine.PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-xl bg-[#14161c] border border-[#262a36] hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {preset.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Lv.{preset.setup.level}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{preset.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{preset.description}</p>

                {/* Preset Item Logos */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0e1015] border border-[#212532]">
                  <ItemIcon
                    item={preset.setup.gear.weapon}
                    quality={getWeaponQuality(preset.setup.gear.weapon)}
                    size="sm"
                    alt={preset.setup.gear.weapon}
                  />
                  <ItemIcon
                    item="helmet"
                    quality={preset.setup.gear.helmet as ItemQuality}
                    size="sm"
                    alt="Helmet"
                  />
                  <ItemIcon
                    item="chest"
                    quality={preset.setup.gear.chest as ItemQuality}
                    size="sm"
                    alt="Chest"
                  />
                  <ItemIcon
                    item={getAmmoKey(preset.setup.gear.ammo)}
                    size="sm"
                    alt="Ammo"
                  />
                  <ItemIcon
                    item={getFoodKey(preset.setup.gear.food)}
                    size="sm"
                    alt="Food"
                  />
                  {preset.setup.gear.stim && (
                    <ItemIcon item="cocain" quality="gold" size="sm" alt="Stim" />
                  )}
                  <div className="ml-auto text-[10px] text-amber-400 font-mono font-bold uppercase">
                    {preset.setup.gear.weapon}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Equip Preset to War Room</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
