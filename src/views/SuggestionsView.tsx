import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  PlayerDTO,
  Language,
  WarDTO,
  BuildMode,
  EquipmentSlot,
  EquipmentItem,
  GeminiNextBestAction
} from '../types';
import {
  SuggestionsService,
  SkillSuggestion,
  GearSuggestion,
  DailyActionStep
} from '../services/suggestionsService';
import { fetchGeminiNextBestAction } from '../services/geminiService';
import { ItemIcon } from '../components/ItemIcon';
import { Badge } from '../components/Badge';
import {
  Sparkles,
  Shield,
  Coins,
  Swords,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Zap,
  Target,
  Award,
  ChevronRight,
  RotateCcw,
  Check,
  Flame,
  Info,
  Compass,
  Bot,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface SuggestionsViewProps {
  player: PlayerDTO;
  language: Language;
  selectedWar?: WarDTO | null;
  onUpdatePlayer: (updated: PlayerDTO) => void;
  onNavigateToWar?: () => void;
  onNavigateToEconomy?: () => void;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  player,
  language,
  selectedWar,
  onUpdatePlayer,
  onNavigateToWar,
  onNavigateToEconomy
}) => {
  const [selectedMode, setSelectedMode] = useState<BuildMode>('soldier');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gemini AI Next-Best-Action state
  const [aiAction, setAiAction] = useState<GeminiNextBestAction | null>(null);
  const [aiSource, setAiSource] = useState<'gemini' | 'fallback'>('gemini');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(true);

  // Generate real-time strategic suggestions
  const analysis = useMemo(() => {
    return SuggestionsService.generateAnalysis(player, selectedMode, selectedWar);
  }, [player, selectedMode, selectedWar]);

  const fetchAiSuggestion = useCallback(async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetchGeminiNextBestAction(player, selectedMode);
      setAiAction(res.action);
      setAiSource(res.source);
    } catch (err) {
      console.error('Failed to load Gemini suggestion:', err);
    } finally {
      setIsLoadingAi(false);
    }
  }, [player.level, player.coins, player.unspentSkillPoints, selectedMode]);

  useEffect(() => {
    fetchAiSuggestion();
  }, [fetchAiSuggestion]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAllocateSkill = (suggestion?: SkillSuggestion) => {
    if ((player.unspentSkillPoints ?? 4) <= 0) {
      showToast('No unspent skill points remaining. Level up in wars or reset points to reallocate!');
      return;
    }

    const targetSuggestion = suggestion || analysis.skillSuggestions[0];
    const updated = SuggestionsService.allocateSkill(player, targetSuggestion.skillKey, 1);
    onUpdatePlayer(updated);
    showToast(`Allocated +1 Point to ${targetSuggestion.skillName}! New Level: ${(updated.skills[targetSuggestion.skillKey] || 0)}`);
  };

  const handleResetPoints = () => {
    const updated: PlayerDTO = {
      ...player,
      unspentSkillPoints: 6
    };
    onUpdatePlayer(updated);
    showToast('Reset skill pool! You have 6 points ready to allocate.');
  };

  const handleBuyAndEquip = (gear: GearSuggestion) => {
    if (player.coins < gear.cost) {
      showToast(`Need ${(gear.cost - player.coins).toLocaleString()} more coins to purchase this item!`);
      return;
    }

    const updated = SuggestionsService.purchaseAndEquip(player, gear.slot, gear.recommendedGear);
    onUpdatePlayer(updated);
    showToast(`Purchased and equipped ${gear.recommendedGear.name}!`);
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const unspentSP = player.unspentSkillPoints ?? 4;
  const bestAffordableGear = analysis.gearSuggestions.find((g) => g.isAffordable);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2330] border border-amber-400/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Character Status Bar */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#23262f]">
          <div className="flex items-center gap-3.5">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.username}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-xl object-cover border border-[#c5a059]/60 shadow-md"
              />
            ) : (
              <div className="w-13 h-13 rounded-xl bg-[#111215] border border-[#c5a059]/40 flex items-center justify-center font-bold text-lg text-[#c5a059]">
                {player.username.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white tracking-wide">{player.username}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#22252c] text-[#c5a059] font-mono border border-[#2c303a]">
                  Level {player.level}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  {player.country} ({player.militaryUnit})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Personalized strategy guidance tailored to your current stats, skill points, and equipment.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-[#111215] border border-[#262933] px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Treasury</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {player.coins.toLocaleString()} $
              </span>
            </div>

            <div className="bg-[#111215] border border-[#262933] px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Energy</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {player.energy} / {player.maxEnergy}
              </span>
            </div>

            <div className={`px-4 py-2 rounded-xl border text-center transition-all ${
              unspentSP > 0 ? 'bg-amber-500/10 border-amber-500/50 shadow-sm' : 'bg-[#111215] border-[#262933]'
            }`}>
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Skill Points</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-base font-extrabold text-white font-mono">{unspentSP}</span>
                <span className="text-[10px] text-amber-300 font-medium">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Next-Best-Action Advisor Card */}
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-[#1b202c] via-[#161a24] to-[#12141c] border border-amber-500/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/50 text-amber-400 flex-shrink-0 mt-0.5 shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded bg-amber-500 text-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Gemini AI • Next-Best-Action
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#202534] text-slate-300 border border-[#2e3549] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {aiSource === 'gemini' ? 'Gemini 3.8 Flash' : 'Strategic Advisor'}
                  </span>
                  {aiAction?.category && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2a2720] text-amber-300 border border-amber-500/30">
                      {aiAction.category === 'gear' ? 'Equipment Upgrade' : aiAction.category === 'skill' ? 'Skill Allocation' : aiAction.category === 'economy' ? 'Economic Move' : 'Tactical Move'}
                    </span>
                  )}
                </div>

                {isLoadingAi ? (
                  <div className="py-2 flex items-center gap-2 text-slate-300 text-xs">
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Evaluating Level {player.level} equipment tiers, currency reserves ({player.coins.toLocaleString()} $), and unspent points...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      {aiAction?.title || analysis.topRecommendationTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                      {aiAction?.why || analysis.topRecommendationReason}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {aiAction?.expectedImpact && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Payoff: {aiAction.expectedImpact}</span>
                        </div>
                      )}
                      {aiAction?.actionSteps && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Compass className="w-3.5 h-3.5 text-amber-400" />
                          <span><strong className="text-slate-200">Action:</strong> {aiAction.actionSteps}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center sm:self-end lg:self-center gap-2 flex-shrink-0 pt-2 lg:pt-0">
              <button
                onClick={fetchAiSuggestion}
                disabled={isLoadingAi}
                title="Re-evaluate with Gemini"
                className="p-2.5 rounded-xl bg-[#222736] hover:bg-[#2c3347] text-slate-300 border border-[#373f54] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoadingAi ? 'animate-spin' : ''}`} />
              </button>

              {unspentSP > 0 ? (
                <button
                  onClick={() => handleAllocateSkill(analysis.skillSuggestions[0])}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Allocate +1 Point ({unspentSP} left)</span>
                </button>
              ) : bestAffordableGear ? (
                <button
                  onClick={() => handleBuyAndEquip(bestAffordableGear)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Shield className="w-4 h-4" />
                  <span>Buy {bestAffordableGear.recommendedGear.name}</span>
                </button>
              ) : (
                <button
                  onClick={handleResetPoints}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-[#222736] hover:bg-[#2b3144] text-slate-300 border border-[#373f54] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Skill Pool</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Playstyle / Focus Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Choose Your Focus
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select how you want to play War Era — recommendations adapt instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#161820] p-1 rounded-xl border border-[#2a2e3b]">
          {[
            { id: 'soldier', label: 'Frontline Soldier', icon: <Swords className="w-3.5 h-3.5" />, desc: 'Max Damage & Medals' },
            { id: 'looter', label: 'Crate Hunter', icon: <Award className="w-3.5 h-3.5" />, desc: 'Cases & Battle Scrap' },
            { id: 'tycoon', label: 'Economic Tycoon', icon: <Coins className="w-3.5 h-3.5" />, desc: 'Passive Gold Empire' }
          ].map((mode) => {
            const isActive = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id as BuildMode)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#202430]'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Section 1: Skill Points Guidance */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Skill Point Suggestions for Level {player.level}
              </h3>
              <p className="text-xs text-slate-400">
                Calculated to give you the highest Return on Investment (ROI) for your next points.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Pool: <strong className="text-amber-400 font-mono">{unspentSP} unspent</strong>
            </span>
            <button
              onClick={handleResetPoints}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline decoration-dotted cursor-pointer"
              title="Reset unspent pool to 6 points to try different builds"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.skillSuggestions.map((skill) => {
            const isTop = skill.priority === 'Critical';
            return (
              <div
                key={skill.id}
                className={`rounded-xl p-4 border flex flex-col justify-between transition-all ${
                  isTop
                    ? 'bg-[#1c1f29] border-amber-500/40 shadow-sm'
                    : 'bg-[#14161c] border-[#292d3a]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isTop ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                    }`}>
                      {skill.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Lv. {skill.currentLevel} → <strong className="text-amber-400">{skill.currentLevel + 1}</strong>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{skill.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {skill.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#0e1014] border border-[#232733] mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Expected Impact</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {skill.impactLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    💡 {skill.whyThisSkill}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#23262f] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Cost: 1 Skill Point</span>
                  <button
                    onClick={() => handleAllocateSkill(skill)}
                    disabled={unspentSP <= 0}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      unspentSP > 0
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Allocate +1</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section 2: Equipment Upgrade Guidance */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Equipment Upgrade Priorities
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by stat gain versus coin cost. Compare current gear with in-game catalog upgrades.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-300">
            Available Gold: <strong className="text-amber-400 font-mono">{player.coins.toLocaleString()} $</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.gearSuggestions.map((gear) => {
            return (
              <div
                key={gear.id}
                className="bg-[#14161c] border border-[#292d3a] rounded-xl p-4 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {gear.slotName} Slot
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      gear.isAffordable
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {gear.isAffordable ? '✓ Affordable Now' : 'Save for this'}
                    </span>
                  </div>

                  {/* Visual Gear Comparison Row */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1116] border border-[#232630] mb-3">
                    {/* Current Gear */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ItemIcon item={gear.currentGear.id || gear.slot} size="md" />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase text-slate-400 font-bold block truncate">Current</span>
                        <span className="text-xs font-semibold text-slate-200 truncate block">
                          {gear.currentGear.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Tier {gear.currentGear.level}</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0" />

                    {/* Recommended Upgrade */}
                    <div className="flex items-center gap-2.5 min-w-0 text-right">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase text-amber-400 font-bold block truncate">Upgrade</span>
                        <span className="text-xs font-bold text-white truncate block">
                          {gear.recommendedGear.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">Tier {gear.recommendedGear.level}</span>
                      </div>
                      <ItemIcon item={gear.recommendedGear.id || gear.slot} size="md" />
                    </div>
                  </div>

                  {/* Stat Gain & Explanation */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Stat Improvement:</span>
                      <span className="font-bold text-emerald-400 font-mono">{gear.statDiff}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Upgrade Cost:</span>
                      <span className="font-bold text-amber-400 font-mono">{gear.cost.toLocaleString()} Coins</span>
                    </div>
                    <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                      {gear.reason}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#23262f] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {gear.isAffordable ? 'Instant in-game upgrade' : `Need ${(gear.cost - player.coins).toLocaleString()} more`}
                  </span>
                  <button
                    onClick={() => handleBuyAndEquip(gear)}
                    disabled={!gear.isAffordable}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      gear.isAffordable
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{gear.isAffordable ? 'Buy & Equip' : 'Locked'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section 3: Today's Action Checklist (Clear 3-Step Daily Plan) */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Today's Step-by-Step Routine
              </h3>
              <p className="text-xs text-slate-400">
                Clear, simple daily actions so you always know what to do when logging in.
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400">
            {Object.values(completedSteps).filter(Boolean).length} of {analysis.dailySteps.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {analysis.dailySteps.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                  isDone
                    ? 'bg-[#121418] border-emerald-500/30 opacity-75'
                    : 'bg-[#14161c] border-[#292d3a] hover:border-amber-400/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Step {step.stepNumber}: {step.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-[#1f232e] text-slate-300 border border-[#2d3342]">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right pl-8 sm:pl-0 flex-shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Reward</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">{step.reward}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
