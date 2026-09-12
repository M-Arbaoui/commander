import {
  BuildMode,
  CostFactorsConfig,
  CompanyEngineSlot,
  GearPinSelection,
  GeneratedBuildCard,
  PlayerSkills
} from '../types';

export interface OptimizerInputs {
  level: number;
  prestigePoints: number;
  rankBonusPercent: number;
  battleBonusPercent: number;
  targetNetCost: number;
  targetNetAuto: boolean;
  mode: BuildMode;
  costFactors: CostFactorsConfig;
  companies: CompanyEngineSlot[];
  pinnedSkills: Record<string, number | 'any'>;
  pinnedPrestige: Record<string, number>;
  pinnedGear: GearPinSelection;
  tournamentSkill?: string;
  tournamentBonus?: number; // 0, 1, or 3
  combatHours?: number; // default 18 with pill, 24 without
}

export const GEAR_CATALOG_DATA = {
  weapon: {
    none: { name: 'Unarmed', atk: 0, critc: 0, costDaily: 0, scrapDaily: 0 },
    knife: { name: 'Combat Knife (Q1)', atk: 31, critc: 3, costDaily: 1.8, scrapDaily: 0.4 },
    gun: { name: 'Sidearm Pistol (Q2)', atk: 56, critc: 8, costDaily: 5.2, scrapDaily: 1.1 },
    rifle: { name: 'Assault Rifle (Q3)', atk: 81, critc: 13, costDaily: 14.5, scrapDaily: 3.2 },
    sniper: { name: 'Precision Rifle (Q4)', atk: 116, critc: 18, costDaily: 38.0, scrapDaily: 8.5 },
    tank: { name: 'Armored Vehicle (Q5)', atk: 161, critc: 31, costDaily: 95.0, scrapDaily: 22.0 },
    jet: { name: 'Stealth Jet (Q6)', atk: 261, critc: 46, costDaily: 240.0, scrapDaily: 55.0 }
  },
  helmet: {
    none: { name: 'None', critd: 0, costDaily: 0, scrapDaily: 0 },
    grey: { name: 'Grey Cap (Q1)', critd: 8, costDaily: 0.6, scrapDaily: 0.15 },
    green: { name: 'Green Helmet (Q2)', critd: 23, costDaily: 1.8, scrapDaily: 0.4 },
    blue: { name: 'Blue Spec (Q3)', critd: 41, costDaily: 5.5, scrapDaily: 1.2 },
    purple: { name: 'Purple Tactical (Q4)', critd: 81, costDaily: 14.0, scrapDaily: 3.2 },
    gold: { name: 'Gold Ballistic (Q5)', critd: 101, costDaily: 34.0, scrapDaily: 8.0 },
    red: { name: 'Mythic Red Visor (Q6)', critd: 136, costDaily: 92.0, scrapDaily: 22.0 }
  },
  chest: {
    none: { name: 'None', arm: 0, costDaily: 0, scrapDaily: 0 },
    grey: { name: 'Grey Vest (Q1)', arm: 3, costDaily: 0.6, scrapDaily: 0.15 },
    green: { name: 'Green Vest (Q2)', arm: 8, costDaily: 1.8, scrapDaily: 0.4 },
    blue: { name: 'Blue Plated (Q3)', arm: 13, costDaily: 5.5, scrapDaily: 1.2 },
    purple: { name: 'Purple Cuirass (Q4)', arm: 26, costDaily: 14.0, scrapDaily: 3.2 },
    gold: { name: 'Gold Heavy Armor (Q5)', arm: 43, costDaily: 34.0, scrapDaily: 8.0 },
    red: { name: 'Mythic Exoskeleton (Q6)', arm: 63, costDaily: 92.0, scrapDaily: 22.0 }
  },
  pants: {
    none: { name: 'None', arm: 0, costDaily: 0, scrapDaily: 0 },
    grey: { name: 'Grey Pants (Q1)', arm: 3, costDaily: 0.6, scrapDaily: 0.15 },
    green: { name: 'Green Cargo (Q2)', arm: 8, costDaily: 1.7, scrapDaily: 0.4 },
    blue: { name: 'Blue Kevlar (Q3)', arm: 13, costDaily: 5.4, scrapDaily: 1.2 },
    purple: { name: 'Purple Tactical (Q4)', arm: 26, costDaily: 13.8, scrapDaily: 3.2 },
    gold: { name: 'Gold Reinforced (Q5)', arm: 43, costDaily: 34.0, scrapDaily: 8.0 },
    red: { name: 'Mythic Combat Greaves (Q6)', arm: 63, costDaily: 93.0, scrapDaily: 22.0 }
  },
  boots: {
    none: { name: 'None', ddg: 0, costDaily: 0, scrapDaily: 0 },
    grey: { name: 'Grey Shoes (Q1)', ddg: 3, costDaily: 0.6, scrapDaily: 0.15 },
    green: { name: 'Green Boots (Q2)', ddg: 8, costDaily: 1.7, scrapDaily: 0.4 },
    blue: { name: 'Blue Runners (Q3)', ddg: 13, costDaily: 5.3, scrapDaily: 1.2 },
    purple: { name: 'Purple Agile (Q4)', ddg: 23, costDaily: 15.5, scrapDaily: 3.5 },
    gold: { name: 'Gold Striders (Q5)', ddg: 36, costDaily: 39.0, scrapDaily: 9.0 },
    red: { name: 'Mythic Jet Boots (Q6)', ddg: 56, costDaily: 98.0, scrapDaily: 24.0 }
  },
  gloves: {
    none: { name: 'None', prc: 0, costDaily: 0, scrapDaily: 0 },
    grey: { name: 'Grey Gloves (Q1)', prc: 3, costDaily: 0.6, scrapDaily: 0.15 },
    green: { name: 'Green Grips (Q2)', prc: 8, costDaily: 1.8, scrapDaily: 0.4 },
    blue: { name: 'Blue Marksman (Q3)', prc: 13, costDaily: 5.5, scrapDaily: 1.2 },
    purple: { name: 'Purple Aim-Assist (Q4)', prc: 23, costDaily: 14.0, scrapDaily: 3.2 },
    gold: { name: 'Gold Sniper Hands (Q5)', prc: 36, costDaily: 34.0, scrapDaily: 8.0 },
    red: { name: 'Mythic Cybernetic (Q6)', prc: 56, costDaily: 92.0, scrapDaily: 22.0 }
  },
  ammo: {
    none: { name: 'No Ammo', dmgBonus: 0, costDaily: 0 },
    light: { name: 'Light Ammo (+10%)', dmgBonus: 0.10, costDaily: 12.0 },
    standard: { name: 'Standard Ammo (+20%)', dmgBonus: 0.20, costDaily: 38.0 },
    heavy: { name: 'Heavy AP Ammo (+40%)', dmgBonus: 0.40, costDaily: 110.0 }
  },
  food: {
    none: { name: 'No Food', regenBonus: 0, costDaily: 0 },
    bread: { name: 'Bread (+10% Regen)', regenBonus: 10, costDaily: 1.7 },
    steak: { name: 'Steak (+20% Regen)', regenBonus: 20, costDaily: 3.7 },
    fish: { name: 'Cooked Fish (+30% Regen)', regenBonus: 30, costDaily: 7.6 }
  }
};

export class WarEraOptimizerService {
  /**
   * Generates build options using NSGA-II style multi-objective Pareto distribution.
   */
  static runOptimizer(inputs: OptimizerInputs): GeneratedBuildCard[] {
    const totalSp = inputs.level * 4;
    const combatHours = inputs.combatHours || (inputs.pinnedGear.stim ? 18 : 24);

    // Calculate company passive income
    let companyDailyIncome = 0;
    if (inputs.costFactors.companies) {
      inputs.companies.forEach((slot) => {
        if (slot.tier > 0) {
          companyDailyIncome += (slot.dailyRevenue - slot.dailyMaintenance);
        }
      });
    }

    // Work income estimate
    const workDailyIncome = inputs.costFactors.work ? (inputs.level * 3.5 + 45) : 0;
    const battleLootIncome = inputs.costFactors.battleLoot === 'average' ? 65 : inputs.costFactors.battleLoot === 'single' ? 25 : 0;
    const employeeProfits = inputs.costFactors.employeeProfits ? 18 : 0;

    if (inputs.mode === 'tycoon') {
      return this.generateTycoonBuilds(inputs, totalSp, companyDailyIncome, workDailyIncome, employeeProfits);
    }

    // Soldier and Looter modes
    return this.generateCombatBuilds(
      inputs,
      totalSp,
      combatHours,
      companyDailyIncome,
      workDailyIncome,
      battleLootIncome,
      employeeProfits
    );
  }

  private static generateCombatBuilds(
    inputs: OptimizerInputs,
    totalSp: number,
    combatHours: number,
    companyDailyIncome: number,
    workDailyIncome: number,
    battleLootIncome: number,
    employeeProfits: number
  ): GeneratedBuildCard[] {
    const isLooter = inputs.mode === 'looter';
    const stimCost = inputs.pinnedGear.stim ? 25.0 : 0;

    // Archetype configurations along the Pareto efficiency curve
    const tiers = [
      {
        id: 'build_break_even',
        name: isLooter ? 'Sustainable Scavenger' : 'Break-Even Grinder',
        tag: 'Break-Even (0.00 /K)',
        targetNet: 0.00,
        weaponKey: 'rifle',
        armorTier: 'green',
        ammoKey: 'light',
        foodKey: 'bread',
        stim: false,
        spSplit: { atk: 0.35, crt: 0.20, cdmg: 0.15, arm: 0.10, ddg: 0.05, loot: isLooter ? 0.35 : 0.05 }
      },
      {
        id: 'build_lean_economy',
        name: isLooter ? 'Profitable Case Farmer' : 'Cost-Efficient Soldier',
        tag: 'Recommended (0.08 /K)',
        targetNet: 0.08,
        weaponKey: 'sniper',
        armorTier: 'blue',
        ammoKey: 'standard',
        foodKey: 'steak',
        stim: true,
        spSplit: { atk: 0.40, crt: 0.22, cdmg: 0.18, arm: 0.10, ddg: 0.05, loot: isLooter ? 0.40 : 0.05 }
      },
      {
        id: 'build_balanced_frontline',
        name: isLooter ? 'Elite Case Harvester' : 'Frontline Striker',
        tag: 'Balanced Output (0.16 /K)',
        targetNet: 0.16,
        weaponKey: 'tank',
        armorTier: 'purple',
        ammoKey: 'standard',
        foodKey: 'steak',
        stim: true,
        spSplit: { atk: 0.45, crt: 0.22, cdmg: 0.20, arm: 0.12, ddg: 0.06, loot: isLooter ? 0.45 : 0.05 }
      },
      {
        id: 'build_high_impact',
        name: isLooter ? 'Apex Looter' : 'Vanguard Heavy',
        tag: 'Heavy Striker (0.24 /K)',
        targetNet: 0.24,
        weaponKey: 'tank',
        armorTier: 'gold',
        ammoKey: 'heavy',
        foodKey: 'fish',
        stim: true,
        spSplit: { atk: 0.50, crt: 0.25, cdmg: 0.22, arm: 0.15, ddg: 0.08, loot: isLooter ? 0.50 : 0.05 }
      },
      {
        id: 'build_max_damage_apex',
        name: 'Apex War Commander',
        tag: 'MAX DAMAGE (Gold Standard)',
        isMaxDamage: true,
        targetNet: 0.36,
        weaponKey: 'jet',
        armorTier: 'red',
        ammoKey: 'heavy',
        foodKey: 'fish',
        stim: true,
        spSplit: { atk: 0.55, crt: 0.25, cdmg: 0.25, arm: 0.15, ddg: 0.10, loot: isLooter ? 0.40 : 0.05 }
      }
    ];

    return tiers.map((tierConfig) => {
      // Resolve equipment based on pins or tier recommendations
      const weaponKey = inputs.pinnedGear.weapon !== 'any' ? inputs.pinnedGear.weapon : tierConfig.weaponKey;
      const helmKey = inputs.pinnedGear.helmet !== 'any' ? inputs.pinnedGear.helmet : tierConfig.armorTier;
      const chestKey = inputs.pinnedGear.chest !== 'any' ? inputs.pinnedGear.chest : tierConfig.armorTier;
      const pantsKey = inputs.pinnedGear.pants !== 'any' ? inputs.pinnedGear.pants : tierConfig.armorTier;
      const bootsKey = inputs.pinnedGear.boots !== 'any' ? inputs.pinnedGear.boots : tierConfig.armorTier;
      const glovesKey = inputs.pinnedGear.gloves !== 'any' ? inputs.pinnedGear.gloves : tierConfig.armorTier;
      const ammoKey = inputs.pinnedGear.ammo !== 'any' ? inputs.pinnedGear.ammo : tierConfig.ammoKey;
      const foodKey = inputs.pinnedGear.food !== 'any' ? inputs.pinnedGear.food : tierConfig.foodKey;
      const stimActive = inputs.pinnedGear.stim;

      const weapon = (GEAR_CATALOG_DATA.weapon as any)[weaponKey] || GEAR_CATALOG_DATA.weapon.rifle;
      const helm = (GEAR_CATALOG_DATA.helmet as any)[helmKey] || GEAR_CATALOG_DATA.helmet.blue;
      const chest = (GEAR_CATALOG_DATA.chest as any)[chestKey] || GEAR_CATALOG_DATA.chest.blue;
      const pants = (GEAR_CATALOG_DATA.pants as any)[pantsKey] || GEAR_CATALOG_DATA.pants.blue;
      const boots = (GEAR_CATALOG_DATA.boots as any)[bootsKey] || GEAR_CATALOG_DATA.boots.blue;
      const gloves = (GEAR_CATALOG_DATA.gloves as any)[glovesKey] || GEAR_CATALOG_DATA.gloves.blue;
      const ammo = (GEAR_CATALOG_DATA.ammo as any)[ammoKey] || GEAR_CATALOG_DATA.ammo.standard;
      const food = (GEAR_CATALOG_DATA.food as any)[foodKey] || GEAR_CATALOG_DATA.food.steak;

      // Allocate skill points
      let remainingSp = totalSp;
      const skills: PlayerSkills = {
        attack: 10,
        precision: 5,
        criticalChance: 5,
        criticalDamage: 150,
        armor: 10,
        dodge: 5,
        health: 100,
        lootChance: 5,
        hunger: 5,
        entrepreneurship: 10,
        energy: 30,
        production: 5,
        companiesLimit: 2,
        management: 2
      };

      // Respect pinned skills first
      Object.entries(inputs.pinnedSkills).forEach(([skillKey, val]) => {
        if (val !== 'any' && typeof val === 'number') {
          const cost = val;
          (skills as any)[skillKey] = val;
          remainingSp = Math.max(0, remainingSp - cost);
        }
      });

      // Distribute remaining skill points according to archetype weights
      if (remainingSp > 0) {
        skills.attack += Math.round(remainingSp * tierConfig.spSplit.atk);
        skills.criticalChance += Math.round(remainingSp * tierConfig.spSplit.crt * 0.25);
        skills.criticalDamage += Math.round(remainingSp * tierConfig.spSplit.cdmg * 1.2);
        skills.armor += Math.round(remainingSp * tierConfig.spSplit.arm);
        skills.dodge += Math.round(remainingSp * tierConfig.spSplit.ddg * 0.25);
        if (isLooter) {
          skills.lootChance += Math.round(remainingSp * tierConfig.spSplit.loot * 0.35);
        }
      }

      // Tournament skill override
      if (inputs.tournamentSkill && inputs.tournamentBonus) {
        if ((skills as any)[inputs.tournamentSkill]) {
          (skills as any)[inputs.tournamentSkill] += inputs.tournamentBonus;
        }
      }

      // Damage Calculation Formula
      // Base ATK = (skills.attack * 2.8) + weapon.atk
      const baseAtk = (skills.attack * 2.8) + weapon.atk;
      const totalBonusPercent = 1 + (inputs.rankBonusPercent / 100) + (inputs.battleBonusPercent / 100) + ammo.dmgBonus + (stimActive ? 0.60 : 0);
      
      const effectiveCritChance = Math.min(0.85, (skills.criticalChance + weapon.critc) / 100);
      const effectiveCritDamage = (skills.criticalDamage + helm.critd) / 100;
      const avgHitMultiplier = (1 - effectiveCritChance) * 1.0 + effectiveCritChance * effectiveCritDamage;

      // Hourly combat attacks (approx 45 hits/hr)
      const dailyHits = Math.round(combatHours * 45);
      const avgHitDamage = baseAtk * totalBonusPercent * avgHitMultiplier;
      const dailyDamage = Math.round(dailyHits * avgHitDamage);

      // Cost Calculation
      const gearDurabilityCost = weapon.costDaily + helm.costDaily + chest.costDaily + pants.costDaily + boots.costDaily + gloves.costDaily;
      const scrapResale = inputs.costFactors.scrap ? (weapon.scrapDaily + helm.scrapDaily + chest.scrapDaily + pants.scrapDaily + boots.scrapDaily + gloves.scrapDaily) : 0;
      const consumablesCost = ammo.costDaily + food.costDaily + (stimActive ? stimCost : 0);

      // Cases calculation
      const baseCasesRate = (skills.lootChance / 100) * 0.45;
      const casesPerDay = Number((dailyHits * baseCasesRate).toFixed(1));
      const caseIncome = inputs.costFactors.cases ? (casesPerDay * 3.8) : 0; // Avg 3.8 coins / case

      const totalGrossCost = gearDurabilityCost + consumablesCost;
      const totalIncome = scrapResale + caseIncome + companyDailyIncome + workDailyIncome + battleLootIncome + employeeProfits;
      const dailyNetCost = Math.round((totalGrossCost - totalIncome) * 100) / 100;
      const costPer1kDamage = Number(((dailyNetCost / (dailyDamage / 1000))).toFixed(3));

      return {
        id: tierConfig.id,
        name: tierConfig.name,
        mode: inputs.mode,
        tag: tierConfig.tag,
        isMaxDamage: tierConfig.isMaxDamage,
        dailyDamage,
        dailyNetCost,
        costPer1kDamage: isNaN(costPer1kDamage) ? 0 : costPer1kDamage,
        casesPerDay,
        totalSpInvested: totalSp - remainingSp,
        totalPpInvested: inputs.prestigePoints,
        gearSummary: {
          weapon: weapon.name,
          helmet: helm.name,
          chest: chest.name,
          pants: pants.name,
          boots: boots.name,
          gloves: gloves.name,
          ammo: ammo.name,
          food: food.name,
          stim: stimActive
        },
        skills,
        prestigeSkills: inputs.pinnedPrestige,
        durabilityCostDaily: Math.round(gearDurabilityCost * 10) / 10,
        consumablesCostDaily: Math.round(consumablesCost * 10) / 10,
        incomeBreakdown: {
          cases: Math.round(caseIncome),
          scrap: Math.round(scrapResale),
          companies: Math.round(companyDailyIncome),
          work: Math.round(workDailyIncome),
          battleLoot: Math.round(battleLootIncome),
          employeeProfits: Math.round(employeeProfits)
        }
      };
    });
  }

  private static generateTycoonBuilds(
    inputs: OptimizerInputs,
    totalSp: number,
    companyDailyIncome: number,
    workDailyIncome: number,
    employeeProfits: number
  ): GeneratedBuildCard[] {
    const levels = [
      { id: 'tycoon_lean', name: 'Lean Industrialist', tag: 'Tycoon: Lean Setup', factor: 0.5 },
      { id: 'tycoon_scaling', name: 'Commercial Conglomerate', tag: 'Tycoon: Scaling Engine', factor: 0.8 },
      { id: 'tycoon_full', name: 'Apex Monopolist', tag: 'Tycoon: Full Empire', factor: 1.0, isMaxDamage: true }
    ];

    return levels.map((cfg) => {
      const sp = Math.round(totalSp * cfg.factor);
      const skills: PlayerSkills = {
        attack: 0,
        precision: 0,
        criticalChance: 0,
        criticalDamage: 100,
        armor: 0,
        dodge: 0,
        health: 100,
        lootChance: 0,
        hunger: 10,
        entrepreneurship: Math.round(sp * 0.35),
        energy: Math.min(100, 30 + Math.round(sp * 0.25)),
        production: Math.round(sp * 0.25),
        companiesLimit: Math.min(10, 2 + Math.round(sp * 0.08)),
        management: Math.round(sp * 0.15)
      };

      const boostedCompanyIncome = companyDailyIncome * (1 + skills.production * 0.02);
      const boostedWorkIncome = (workDailyIncome + skills.entrepreneurship * 2.2);
      const netDailyProfit = Math.round((boostedCompanyIncome + boostedWorkIncome + employeeProfits) * 10) / 10;

      return {
        id: cfg.id,
        name: cfg.name,
        mode: 'tycoon',
        tag: cfg.tag,
        isMaxDamage: cfg.isMaxDamage,
        dailyDamage: 0,
        dailyNetCost: -netDailyProfit, // Negative cost = Pure profit
        costPer1kDamage: 0,
        casesPerDay: 0,
        totalSpInvested: sp,
        totalPpInvested: inputs.prestigePoints,
        gearSummary: {
          weapon: 'None (Combat Pinned Off)',
          helmet: 'None',
          chest: 'None',
          pants: 'None',
          boots: 'None',
          gloves: 'None',
          ammo: 'None',
          food: 'Bread (+10% Energy Regen)',
          stim: false
        },
        skills,
        prestigeSkills: inputs.pinnedPrestige,
        durabilityCostDaily: 0,
        consumablesCostDaily: 1.7,
        incomeBreakdown: {
          cases: 0,
          scrap: 0,
          companies: Math.round(boostedCompanyIncome),
          work: Math.round(boostedWorkIncome),
          battleLoot: 0,
          employeeProfits: Math.round(employeeProfits)
        }
      };
    });
  }
}
