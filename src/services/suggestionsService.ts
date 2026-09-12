import {
  PlayerDTO,
  PlayerSkills,
  EquipmentSlot,
  EquipmentItem,
  WarDTO,
  BuildMode
} from '../types';
import { BASE_EQUIPMENT_CATALOG, VERIFIED_WARS_LIST } from './gameData';

export interface SkillSuggestion {
  id: string;
  skillKey: keyof PlayerSkills;
  skillName: string;
  category: 'combat' | 'economy';
  currentLevel: number;
  recommendedDelta: number;
  priority: 'Critical' | 'High' | 'Good';
  badge: string;
  title: string;
  description: string;
  impactLabel: string;
  spCost: number;
  whyThisSkill: string;
}

export interface GearSuggestion {
  id: string;
  slot: EquipmentSlot;
  slotName: string;
  currentGear: EquipmentItem;
  recommendedGear: EquipmentItem;
  cost: number;
  isAffordable: boolean;
  priority: 'Top Priority' | 'High Value' | 'Next Target';
  statDiff: string;
  reason: string;
}

export interface DailyActionStep {
  id: string;
  stepNumber: number;
  title: string;
  category: 'work' | 'combat' | 'prep' | 'growth';
  badge: string;
  description: string;
  reward: string;
  actionHint: string;
}

export interface PlayerStrategicAnalysis {
  combatPowerScore: number;
  economyPowerScore: number;
  unspentSkillPoints: number;
  primaryArchetype: BuildMode;
  topRecommendationTitle: string;
  topRecommendationReason: string;
  skillSuggestions: SkillSuggestion[];
  gearSuggestions: GearSuggestion[];
  dailySteps: DailyActionStep[];
}

export class SuggestionsService {
  /**
   * Generates comprehensive, personalized suggestions based directly on
   * player level, current skills, equipped gear, and coins.
   */
  static generateAnalysis(
    player: PlayerDTO,
    mode: BuildMode = 'soldier',
    activeWar?: WarDTO | null
  ): PlayerStrategicAnalysis {
    const unspentSP = player.unspentSkillPoints ?? Math.max(3, 4);

    // 1. Calculate Power Scores
    const combatPower = Math.round(
      player.skills.attack * 1.5 +
      player.skills.precision * 1.2 +
      player.skills.criticalChance * 2.5 +
      player.skills.criticalDamage * 0.4 +
      player.skills.armor * 1.8 +
      player.skills.dodge * 2.0 +
      player.skills.health * 0.8
    );

    const economyPower = Math.round(
      player.skills.entrepreneurship * 2.5 +
      player.skills.companiesLimit * 40 +
      player.skills.production * 3.0 +
      player.skills.management * 8.0 +
      player.skills.energy * 2.0
    );

    // 2. Compute Tailored Skill Point Suggestions
    const skillSuggestions: SkillSuggestion[] = [];

    if (mode === 'soldier') {
      // Precision Check (Soldier needs precision to avoid glance damage)
      const ratio = player.skills.precision / (player.skills.attack || 1);
      if (ratio < 0.4) {
        skillSuggestions.push({
          id: 'soldier_precision',
          skillKey: 'precision',
          skillName: 'Precision',
          category: 'combat',
          currentLevel: player.skills.precision,
          recommendedDelta: 3,
          priority: 'Critical',
          badge: 'Highest Hit Rate',
          title: 'Calibrate Accuracy & Precision',
          description: `Your Attack is ${player.skills.attack}, but Precision is only ${player.skills.precision}. In War Era, this causes up to 24% of your hits to glance or miss.`,
          impactLabel: '+14.5% Average Damage per Energy',
          spCost: 3,
          whyThisSkill: `At Level ${player.level}, high level defenders have elevated dodge. Investing 3 points here immediately prevents glancing shots.`
        });
      }

      // Critical Chance Check
      if (player.skills.criticalChance < 50) {
        skillSuggestions.push({
          id: 'soldier_crit',
          skillKey: 'criticalChance',
          skillName: 'Critical Chance',
          category: 'combat',
          currentLevel: player.skills.criticalChance,
          recommendedDelta: 2,
          priority: 'High',
          badge: 'Burst Damage',
          title: 'Boost Critical Strike Frequency',
          description: `You currently have a ${player.skills.criticalChance}% chance to critically strike with a ${player.skills.criticalDamage}% damage multiplier.`,
          impactLabel: `+6.0% Crit Frequency (Every 2.5 hits)`,
          spCost: 2,
          whyThisSkill: `With your ${player.skills.criticalDamage}% critical damage bonus, each critical hit is devastating in wars.`
        });
      }

      // Attack Power Scaling
      skillSuggestions.push({
        id: 'soldier_attack',
        skillKey: 'attack',
        skillName: 'Attack',
        category: 'combat',
        currentLevel: player.skills.attack,
        recommendedDelta: 2,
        priority: 'Good',
        badge: 'Raw Power',
        title: 'Increase Base Weapon Impact',
        description: `Raise your base Attack from ${player.skills.attack} to ${player.skills.attack + 10} for stronger baseline hits.`,
        impactLabel: '+35 Damage per hit multiplier',
        spCost: 2,
        whyThisSkill: `Attack directly multiplies with weapon damage and combat bonuses.`
      });

      // Armor Check
      if (player.skills.armor < 50) {
        skillSuggestions.push({
          id: 'soldier_armor',
          skillKey: 'armor',
          skillName: 'Armor',
          category: 'combat',
          currentLevel: player.skills.armor,
          recommendedDelta: 2,
          priority: 'Good',
          badge: 'Damage Reduction',
          title: 'Bolster Defensive Armor',
          description: `Your current armor is ${player.skills.armor}. Increasing armor minimizes health lost per combat round.`,
          impactLabel: '-12% Damage Taken from Enemies',
          spCost: 2,
          whyThisSkill: `Higher armor lets you survive more combat rounds without exhausting food rations.`
        });
      }
    } else if (mode === 'looter') {
      // Loot Chance Focus
      skillSuggestions.push({
        id: 'looter_chance',
        skillKey: 'lootChance',
        skillName: 'Loot Chance',
        category: 'combat',
        currentLevel: player.skills.lootChance,
        recommendedDelta: 3,
        priority: 'Critical',
        badge: 'Crate Drop Rate',
        title: 'Max Out Battlefield Scavenging',
        description: `Your Loot Chance is currently ${player.skills.lootChance}%. Raising it to ${player.skills.lootChance + 3}% reaches the next loot table milestone.`,
        impactLabel: '+28% More Weapon Crates & Scrap',
        spCost: 3,
        whyThisSkill: `At Level ${player.level}, selling battlefield cases is the fastest liquid cash generator in the game.`
      });

      // Energy Pool
      skillSuggestions.push({
        id: 'looter_energy',
        skillKey: 'energy',
        skillName: 'Energy',
        category: 'economy',
        currentLevel: player.skills.energy,
        recommendedDelta: 2,
        priority: 'High',
        badge: 'More Daily Hits',
        title: 'Expand Total Energy Reserves',
        description: `Increase your maximum combat energy from ${player.maxEnergy} to ${player.maxEnergy + 10} for longer looting runs.`,
        impactLabel: '+2 Additional Battle Hits per Full Bar',
        spCost: 2,
        whyThisSkill: `More energy pool directly equals more roll attempts for crates every day.`
      });

      // Precision
      skillSuggestions.push({
        id: 'looter_precision',
        skillKey: 'precision',
        skillName: 'Precision',
        category: 'combat',
        currentLevel: player.skills.precision,
        recommendedDelta: 2,
        priority: 'Good',
        badge: 'Reliable Hits',
        title: 'Stabilize Looting Accuracy',
        description: `Ensures hits connect so you never waste energy on dodged attempts.`,
        impactLabel: 'Guarantees drop eligibility on hit',
        spCost: 2,
        whyThisSkill: `Cases and battle scraps only drop when you land a valid hit on an enemy.`
      });
    } else {
      // Tycoon Focus
      skillSuggestions.push({
        id: 'tycoon_companies',
        skillKey: 'companiesLimit',
        skillName: 'Companies Limit',
        category: 'economy',
        currentLevel: player.skills.companiesLimit,
        recommendedDelta: 2,
        priority: 'Critical',
        badge: 'Passive Empire',
        title: 'Unlock Additional Enterprise Slots',
        description: `You can currently own ${player.skills.companiesLimit} companies. Increasing to ${player.skills.companiesLimit + 1} allows another profitable factory.`,
        impactLabel: '+750 to +1,200 Daily Gold Revenue',
        spCost: 2,
        whyThisSkill: `Owning companies generates steady cash flow while you sleep or fight.`
      });

      skillSuggestions.push({
        id: 'tycoon_entrepreneur',
        skillKey: 'entrepreneurship',
        skillName: 'Entrepreneurship',
        category: 'economy',
        currentLevel: player.skills.entrepreneurship,
        recommendedDelta: 3,
        priority: 'High',
        badge: 'Profit Margins',
        title: 'Boost Worker Output & Profits',
        description: `Your entrepreneurship is at ${player.skills.entrepreneurship}. Each point boosts employee output by 1.5%.`,
        impactLabel: '+18% Profit on Manufactured Goods',
        spCost: 3,
        whyThisSkill: `Maximizes returns on raw steel, ammo production, and food rationing.`
      });

      skillSuggestions.push({
        id: 'tycoon_production',
        skillKey: 'production',
        skillName: 'Production',
        category: 'economy',
        currentLevel: player.skills.production,
        recommendedDelta: 2,
        priority: 'Good',
        badge: 'Crafting Speed',
        title: 'Accelerate Manufacturing Cycles',
        description: `Cuts down the time needed to produce ammunition and rations in your factories.`,
        impactLabel: '-10% Production Time',
        spCost: 2,
        whyThisSkill: `Produces ammunition faster so you can supply allies and sell on the market.`
      });
    }

    // 3. Compute Gear Upgrade Suggestions
    const gearSuggestions: GearSuggestion[] = [];
    const slots: EquipmentSlot[] = ['weapon', 'helmet', 'chest', 'pants', 'boots', 'gloves'];

    for (const slot of slots) {
      const current = player.equipment[slot];
      const catalog = BASE_EQUIPMENT_CATALOG[slot] || [];
      if (!current || catalog.length === 0) continue;

      // Find an upgrade in the catalog with higher tier/bonus
      const upgrade = catalog.find(
        (item) => item.level > current.level || (item.attackBonus + item.armorBonus > current.attackBonus + current.armorBonus)
      );

      if (upgrade && upgrade.id !== current.id) {
        const cost = upgrade.upgradeCost || 1500;
        const isAffordable = player.coins >= cost;

        let statDiff = '';
        if (upgrade.attackBonus > current.attackBonus) {
          statDiff += `+${upgrade.attackBonus - current.attackBonus} ATK `;
        }
        if (upgrade.armorBonus > current.armorBonus) {
          statDiff += `+${upgrade.armorBonus - current.armorBonus} ARM `;
        }
        if (upgrade.critChanceBonus > current.critChanceBonus) {
          statDiff += `+${((upgrade.critChanceBonus - current.critChanceBonus) * 100).toFixed(0)}% Crit `;
        }
        if (upgrade.dodgeBonus > current.dodgeBonus) {
          statDiff += `+${((upgrade.dodgeBonus - current.dodgeBonus) * 100).toFixed(0)}% Dodge `;
        }

        const slotName = slot.charAt(0).toUpperCase() + slot.slice(1);
        let priority: 'Top Priority' | 'High Value' | 'Next Target' = 'Next Target';
        if (slot === 'weapon') priority = 'Top Priority';
        else if (slot === 'chest' || isAffordable) priority = 'High Value';

        gearSuggestions.push({
          id: `gear_${slot}`,
          slot,
          slotName,
          currentGear: current,
          recommendedGear: upgrade,
          cost,
          isAffordable,
          priority,
          statDiff: statDiff.trim() || '+Significant Combat Boost',
          reason: isAffordable
            ? `Cost is ${cost.toLocaleString()} coins. You have ${player.coins.toLocaleString()} coins in liquid treasury, so you can purchase this right now!`
            : `Cost is ${cost.toLocaleString()} coins. Save ${(cost - player.coins).toLocaleString()} more coins from daily work and wars to acquire this.`
        });
      }
    }

    // Sort gear suggestions by priority and affordability
    gearSuggestions.sort((a, b) => {
      if (a.isAffordable && !b.isAffordable) return -1;
      if (!a.isAffordable && b.isAffordable) return 1;
      return a.cost - b.cost;
    });

    // 4. Compute Daily Action Guide (Where to start right now)
    const warName = activeWar?.region || VERIFIED_WARS_LIST[0]?.region || 'Central Front';
    const dailySteps: DailyActionStep[] = [
      {
        id: 'step_1',
        stepNumber: 1,
        title: 'Collect Daily Work Income',
        category: 'work',
        badge: 'Guaranteed Coins',
        description: 'Work a daily shift in a verified Q3+ factory to collect your wage and maintain work streak bonuses.',
        reward: '+380 to +520 Coins & +10 XP',
        actionHint: 'Visit Company view to work or clock in with your employer.'
      },
      {
        id: 'step_2',
        stepNumber: 2,
        title: `Deploy 30 Energy in ${warName}`,
        category: 'combat',
        badge: 'War Medals & Crates',
        description: `Spend your available combat energy fighting for your country in ${warName}. Use Standard Ammo for maximum medal efficiency.`,
        reward: 'War Hero Medals, +1,400 XP & Chance for Crates',
        actionHint: 'Head to War Front and click Fight.'
      },
      {
        id: 'step_3',
        stepNumber: 3,
        title: 'Invest Unspent Points & Upgrade Gear',
        category: 'growth',
        badge: 'Power Spike',
        description: `You have ${unspentSP} unspent Skill Points. Allocate them into ${skillSuggestions[0]?.skillName || 'Precision'} for an immediate damage jump.`,
        reward: `${skillSuggestions[0]?.impactLabel || 'Permanent Character Boost'}`,
        actionHint: 'Click Allocate in the suggestions panel below.'
      }
    ];

    // 5. Top Recommendation Banner
    let topRecommendationTitle = 'Invest in Precision to eliminate glancing hits';
    let topRecommendationReason = `At Level ${player.level}, your raw damage is strong, but your hit accuracy is holding you back. Allocate your next points into Precision.`;

    if (gearSuggestions.length > 0 && gearSuggestions[0].isAffordable) {
      topRecommendationTitle = `Upgrade ${gearSuggestions[0].slotName} to ${gearSuggestions[0].recommendedGear.name}`;
      topRecommendationReason = `You have ${player.coins.toLocaleString()} coins ready. This upgrade grants ${gearSuggestions[0].statDiff} for only ${gearSuggestions[0].cost.toLocaleString()} coins.`;
    } else if (skillSuggestions.length > 0) {
      topRecommendationTitle = skillSuggestions[0].title;
      topRecommendationReason = skillSuggestions[0].description;
    }

    return {
      combatPowerScore: combatPower,
      economyPowerScore: economyPower,
      unspentSkillPoints: unspentSP,
      primaryArchetype: mode,
      topRecommendationTitle,
      topRecommendationReason,
      skillSuggestions,
      gearSuggestions,
      dailySteps
    };
  }

  /**
   * Helper to allocate 1 or more skill points and return a clean updated player DTO.
   */
  static allocateSkill(player: PlayerDTO, skillKey: keyof PlayerSkills, delta: number = 1): PlayerDTO {
    const currentUnspent = player.unspentSkillPoints ?? 4;
    const pointsToUse = Math.min(currentUnspent, delta);
    if (pointsToUse <= 0) return player;

    return {
      ...player,
      unspentSkillPoints: Math.max(0, currentUnspent - pointsToUse),
      skills: {
        ...player.skills,
        [skillKey]: (player.skills[skillKey] || 0) + pointsToUse
      }
    };
  }

  /**
   * Helper to equip a suggested item and deduct cost.
   */
  static purchaseAndEquip(player: PlayerDTO, slot: EquipmentSlot, targetItem: EquipmentItem): PlayerDTO {
    const cost = targetItem.upgradeCost || 0;
    if (player.coins < cost) return player;

    return {
      ...player,
      coins: player.coins - cost,
      equipment: {
        ...player.equipment,
        [slot]: targetItem
      }
    };
  }
}
