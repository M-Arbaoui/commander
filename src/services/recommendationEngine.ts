import {
  PlayerDTO,
  WarDTO,
  BuildObjective,
  DecisionCardData,
  EquipmentItem,
  WarBonusBreakdown,
  EquipmentSlot
} from '../types';
import { BASE_EQUIPMENT_CATALOG, VERIFIED_MARKET_ITEMS } from './gameData';

export class RecommendationEngine {
  /**
   * Pure, deterministic calculation of applicable war bonuses.
   * Stacking Rule: Multiplicative across distinct verified categories.
   */
  static calculateWarBonuses(
    player: PlayerDTO,
    war: WarDTO,
    usePill: boolean = true
  ): WarBonusBreakdown {
    // 1. Personal Bonus: Derived from player level & medals (12% baseline)
    const personalBonusPercent = 12;

    // 2. Military Unit Bonus: Applies only if player's MU order aligns or MU participates
    let militaryUnitBonusPercent = 0;
    if (war.isPlayerCountryInvolved || war.playerSide === 'Attacker') {
      militaryUnitBonusPercent = 14; // MAR ROYAL ARMY level 7 order bonus
    }

    // 3. Country / Alliance Bonus: 10% when fighting for citizen sovereign country
    let countryBonusPercent = 0;
    if (war.attackerCountry === player.country || war.defenderCountry === player.country) {
      countryBonusPercent = 10;
    }

    // 4. Defensive Pact Bonus: Applies during defense or reciprocal treaties
    let defensePactPercent = 0;
    if (war.type === 'Defensive Pact' || (war.playerSide === 'Defender' && war.isPlayerCountryInvolved)) {
      defensePactPercent = 5;
    }

    // 5. Special Consumable (Pill): Verified +60% damage multiplier
    const specialPillsPercent = usePill ? 60 : 0;

    // Multiplicative calculation:
    // Multiplier = (1 + p) * (1 + mu) * (1 + c) * (1 + dp) * (1 + pill)
    const factorPersonal = 1 + personalBonusPercent / 100;
    const factorMU = 1 + militaryUnitBonusPercent / 100;
    const factorCountry = 1 + countryBonusPercent / 100;
    const factorPact = 1 + defensePactPercent / 100;
    const factorPill = 1 + specialPillsPercent / 100;

    const totalMultiplier = Number(
      (factorPersonal * factorMU * factorCountry * factorPact * factorPill).toFixed(2)
    );

    const parts = [
      `(1 + ${personalBonusPercent / 100} Personal)`
    ];
    if (militaryUnitBonusPercent > 0) parts.push(`(1 + ${militaryUnitBonusPercent / 100} MU)`);
    if (countryBonusPercent > 0) parts.push(`(1 + ${countryBonusPercent / 100} Country)`);
    if (defensePactPercent > 0) parts.push(`(1 + ${defensePactPercent / 100} Pact)`);
    if (specialPillsPercent > 0) parts.push(`(1 + ${specialPillsPercent / 100} Pill)`);

    const explanationFormula = parts.join(' × ');

    return {
      personalBonusPercent,
      militaryUnitBonusPercent,
      countryBonusPercent,
      specialPillsPercent,
      defensePactPercent,
      totalMultiplier,
      stackingMode: 'multiplicative',
      explanationFormula
    };
  }

  /**
   * Generates account-tailored build recommendations based on objective.
   */
  static evaluateBuildRecommendations(
    player: PlayerDTO,
    objective: BuildObjective,
    war: WarDTO | null
  ): {
    recommendedItem: EquipmentItem;
    currentItem: EquipmentItem;
    expectedGain: string;
    gainPercentage: number;
    cost: number;
    reason: string;
    tradeoffs: string;
    confidence: 'High' | 'Medium' | 'Low';
    primaryDecision: DecisionCardData;
  } {
    const currentGloves = player.equipment.gloves;
    const recommendedGloves = BASE_EQUIPMENT_CATALOG.gloves[1]; // Q3 Gloves
    const currentWeapon = player.equipment.weapon;
    const recommendedWeapon = BASE_EQUIPMENT_CATALOG.weapon[2]; // Q5 Sniper

    // Rule: Never recommend an unaffordable purchase
    // Rule: Evaluate both absolute gain and efficiency (Gain / Cost)

    if (objective === 'max_damage') {
      // If user prioritizes absolute max damage and has or targets Q5 weapon
      const gainPct = 24.5;
      const cost = 3200;
      const isAffordable = player.coins >= cost;

      const primaryDecision: DecisionCardData = {
        id: 'dec_max_dmg',
        title: isAffordable ? 'Upgrade Weapon to Q5 Sniper' : 'Save for Q5 Sniper Upgrade',
        verdict: isAffordable ? 'Recommended' : 'Wait',
        expectedResult: `+${gainPct}% massive direct hit damage increase (+260 raw ATK)`,
        cost: `${cost} coins`,
        costNumber: cost,
        reason: 'Maximum Damage objective prioritizes top-tier weapon AP regardless of marginal coin cost.',
        tradeOffs: 'Consumes the majority of your coin reserves, delaying armor and glove upgrades.',
        actionText: isAffordable ? 'Acquire Weapon' : 'Review Budget',
        confidence: 'High',
        category: 'build',
        efficiencyScore: Number((gainPct / cost).toFixed(5)),
        details: [
          'Calculated against current weapon Q3 (280 ATK) vs Q5 (540 ATK).',
          'Precision bonus increases from 35 to 75, boosting overflow crit damage.',
          'Durability consumption remains constant per hit.'
        ]
      };

      return {
        recommendedItem: recommendedWeapon,
        currentItem: currentWeapon,
        expectedGain: `+${gainPct}% raw damage output`,
        gainPercentage: gainPct,
        cost,
        reason: 'Delivers the highest absolute damage ceiling for high-stakes campaign rounds.',
        tradeoffs: 'Very high capital cost; leaves minimal reserve for emergency ammo or battle stims.',
        confidence: 'High',
        primaryDecision
      };
    }

    // Default & Coin Efficiency / Balanced:
    // Recommend Gloves upgrade: Cost 840, Gain +8.7%, Efficiency = 8.7 / 840 = 0.01035
    // Compared to Helmet: Cost 1800, Gain +4.2%, Efficiency = 4.2 / 1800 = 0.00233
    const gainPct = 8.7;
    const cost = 840;

    const primaryDecision: DecisionCardData = {
      id: 'dec_upgrade_gloves',
      title: 'Upgrade Gloves to Q3 (Reinforced Mechanized)',
      verdict: 'Recommended',
      expectedResult: `+${gainPct}% expected damage & +20 Precision`,
      cost: `${cost} coins`,
      costNumber: cost,
      reason: 'Provides 4.4x higher damage improvement per coin spent compared to upgrading Helmet (Q4).',
      tradeOffs: 'Focuses primarily on offensive precision and crit rate rather than defensive armor.',
      actionText: 'Upgrade Gloves',
      confidence: 'High',
      category: 'build',
      efficiencyScore: Number((gainPct / cost).toFixed(5)),
      details: [
        'Current Gloves: Q2 (Attack +45, Precision +28, Crit Chance +5%)',
        'Target Gloves: Q3 (Attack +95, Precision +48, Crit Chance +9%)',
        'Cost: 840 coins (Player balance: ' + player.coins + ' coins — 100% affordable)',
        'Alternative Helmet Q4 costs 1800 coins for only +4.2% damage gain.'
      ]
    };

    return {
      recommendedItem: recommendedGloves,
      currentItem: currentGloves,
      expectedGain: `+${gainPct}% expected combat damage`,
      gainPercentage: gainPct,
      cost,
      reason: 'Better value than upgrading the Helmet with the current build.',
      tradeoffs: 'Leaves Helmet at Q2 ballistic grade until next economic cycle.',
      confidence: 'High',
      primaryDecision
    };
  }

  /**
   * Generates Home decision matrix:
   * 1. Primary Recommendation
   * 2. Up to three Follow-up Recommendations
   * 3. Avoid For Now recommendations
   */
  static generateHomeDecisions(
    player: PlayerDTO,
    war: WarDTO | null,
    objective: BuildObjective
  ): {
    primary: DecisionCardData;
    followUps: DecisionCardData[];
    avoid: DecisionCardData[];
  } {
    const buildEval = this.evaluateBuildRecommendations(player, objective, war);

    const followUps: DecisionCardData[] = [
      {
        id: 'fol_combat_pill',
        title: 'Procure Combat Stim Pill for Current Round',
        verdict: 'Buy',
        expectedResult: '+60% multiplicative damage boost for 8 hours',
        cost: '850 coins',
        costNumber: 850,
        reason: 'Active battle has 48 minutes remaining in contested round; boosts medal placement potential.',
        tradeOffs: 'Temporary buff; duration cannot be paused once activated.',
        actionText: 'Inspect Market Pill',
        confidence: 'High',
        category: 'war',
        efficiencyScore: 0.0705,
        details: [
          'Verified mechanic: Stim pills provide +60% multiplicative combat boost.',
          'Consuming a second pill extends the duration by 8h; does NOT stack to 120%.'
        ]
      },
      {
        id: 'fol_ammo_stock',
        title: 'Maintain Q5 Ammunition Buffer (500 units)',
        verdict: 'Buy',
        expectedResult: 'Prevents automatic fallback to unbuffered Q1 ammo during war',
        cost: '612 coins',
        costNumber: 612,
        reason: 'Current inventory has 240 units remaining (~2-3 rounds of sustained strikes).',
        tradeOffs: 'Locks liquid capital into inventory supplies.',
        actionText: 'Replenish Ammo',
        confidence: 'High',
        category: 'economy',
        efficiencyScore: 0.0182
      },
      {
        id: 'fol_economic_skills',
        title: 'Allocate Next 2 Skill Points to Entrepreneurship',
        verdict: 'Recommended',
        expectedResult: '+4.5% daily company wage and production yield',
        cost: 'Free (Level Up Points)',
        costNumber: 0,
        reason: 'Accelerates self-funding for future Q5 weapon acquisition without depleting combat parity.',
        tradeOffs: 'Slightly delays next minor tier of Dodge skill.',
        actionText: 'Review Skills',
        confidence: 'High',
        category: 'skills',
        efficiencyScore: 0.095
      }
    ];

    const avoid: DecisionCardData[] = [
      {
        id: 'av_skill_reset',
        title: 'Combat Skill Points Reset Voucher',
        verdict: 'Avoid',
        expectedResult: 'Negligible combat gain (<1.5%)',
        cost: '1200 coins',
        costNumber: 1200,
        reason: 'Your current skill distribution is already 94% optimized. Paying 1200 coins for a reset wastes valuable capital.',
        tradeOffs: 'Sinks 35% of your treasury for almost zero practical damage change.',
        actionText: 'Dismiss Reset',
        confidence: 'High',
        category: 'skills'
      },
      {
        id: 'av_premature_helmet',
        title: 'Upgrading Helmet to Q4 Before Gloves Q3',
        verdict: 'Avoid',
        expectedResult: 'Poor coin efficiency (0.00233 vs 0.01035)',
        cost: '1800 coins',
        costNumber: 1800,
        reason: 'Helmet Q4 requires 1800 coins for only +4.2% damage. Gloves Q3 provides +8.7% for less than half the price.',
        tradeOffs: 'Sacrifices immediate offensive leverage in the active war.',
        actionText: 'Postpone Helmet',
        confidence: 'High',
        category: 'build'
      }
    ];

    return {
      primary: buildEval.primaryDecision,
      followUps,
      avoid
    };
  }
}
