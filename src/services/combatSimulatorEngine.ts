import {
  PlayerDTO,
  CombatRoundLog,
  CombatSimulationSummary,
  PlayerSkills
} from '../types';
import { GEAR_CATALOG_DATA } from './warEraOptimizer';

export interface CombatAttackerSetup {
  level: number;
  militaryRankBonus: number; // e.g. 12.5%
  battleBonus: number;       // e.g. 60%
  skills: PlayerSkills;
  gear: {
    weapon: string; // knife, gun, rifle, sniper, tank, jet
    helmet: string; // grey, green, blue, purple, gold, red
    chest: string;
    pants: string;
    boots: string;
    gloves: string;
    ammo: string;   // none, light, standard, heavy
    food: string;   // none, bread, steak, fish
    stim: boolean;
  };
}

export interface CombatDefenderSetup {
  name: string;
  armor: number; // e.g. 85
  dodge: number; // e.g. 15%
  health: number; // e.g. 50000
}

export interface PresetArchetype {
  id: string;
  name: string;
  description: string;
  badge: string;
  setup: CombatAttackerSetup;
}

export class CombatSimulatorEngine {
  static readonly PRESETS: PresetArchetype[] = [
    {
      id: 'max_dps_chad',
      name: 'Vanguard Titan (Max DPS Q6)',
      description: 'Maximum damage loadout utilizing Stealth Jet, Mythic Red armor, Heavy AP ammo & Stim Pill.',
      badge: 'Max DPS',
      setup: {
        level: 35,
        militaryRankBonus: 25.0,
        battleBonus: 60.0,
        skills: {
          attack: 85,
          precision: 30,
          criticalChance: 35,
          criticalDamage: 240,
          armor: 30,
          dodge: 15,
          health: 250,
          lootChance: 10,
          hunger: 10,
          entrepreneurship: 10,
          energy: 60,
          production: 10,
          companiesLimit: 3,
          management: 5
        },
        gear: {
          weapon: 'jet',
          helmet: 'red',
          chest: 'red',
          pants: 'red',
          boots: 'red',
          gloves: 'red',
          ammo: 'heavy',
          food: 'fish',
          stim: true
        }
      }
    },
    {
      id: 'sustainable_grinder',
      name: 'Sustainable War Grinder',
      description: 'Break-even loadout balancing Assault Rifle (Q3), Blue gear and Standard ammo for cost neutrality.',
      badge: 'Cost Neutral',
      setup: {
        level: 25,
        militaryRankBonus: 12.5,
        battleBonus: 40.0,
        skills: {
          attack: 50,
          precision: 20,
          criticalChance: 20,
          criticalDamage: 180,
          armor: 25,
          dodge: 10,
          health: 180,
          lootChance: 15,
          hunger: 10,
          entrepreneurship: 15,
          energy: 50,
          production: 10,
          companiesLimit: 2,
          management: 5
        },
        gear: {
          weapon: 'rifle',
          helmet: 'blue',
          chest: 'blue',
          pants: 'blue',
          boots: 'blue',
          gloves: 'blue',
          ammo: 'standard',
          food: 'steak',
          stim: false
        }
      }
    },
    {
      id: 'loot_case_farmer',
      name: 'Case Harvester Special',
      description: 'Specialized build pumping Loot Chance and Agility for farming high-value crates at minimum cost.',
      badge: 'Case Farmer',
      setup: {
        level: 20,
        militaryRankBonus: 8.0,
        battleBonus: 30.0,
        skills: {
          attack: 35,
          precision: 15,
          criticalChance: 15,
          criticalDamage: 160,
          armor: 15,
          dodge: 18,
          health: 140,
          lootChance: 45,
          hunger: 10,
          entrepreneurship: 20,
          energy: 50,
          production: 5,
          companiesLimit: 2,
          management: 2
        },
        gear: {
          weapon: 'gun',
          helmet: 'green',
          chest: 'green',
          pants: 'green',
          boots: 'purple',
          gloves: 'green',
          ammo: 'light',
          food: 'bread',
          stim: false
        }
      }
    },
    {
      id: 'budget_frontline',
      name: 'Budget Guerilla (Q2)',
      description: 'Entry-level frontline setup for recruits to participate in territory battles without draining coin reserves.',
      badge: 'Budget Q2',
      setup: {
        level: 15,
        militaryRankBonus: 4.0,
        battleBonus: 25.0,
        skills: {
          attack: 28,
          precision: 10,
          criticalChance: 10,
          criticalDamage: 140,
          armor: 15,
          dodge: 8,
          health: 120,
          lootChance: 10,
          hunger: 5,
          entrepreneurship: 10,
          energy: 35,
          production: 5,
          companiesLimit: 1,
          management: 2
        },
        gear: {
          weapon: 'knife',
          helmet: 'grey',
          chest: 'grey',
          pants: 'grey',
          boots: 'grey',
          gloves: 'grey',
          ammo: 'light',
          food: 'bread',
          stim: false
        }
      }
    }
  ];

  static buildSetupFromPlayer(player: PlayerDTO): CombatAttackerSetup {
    return {
      level: player.level,
      militaryRankBonus: (player.militaryRank || 1) * 0.25,
      battleBonus: 60.0,
      skills: { ...player.skills },
      gear: {
        weapon: 'rifle',
        helmet: 'blue',
        chest: 'blue',
        pants: 'blue',
        boots: 'blue',
        gloves: 'blue',
        ammo: 'standard',
        food: 'steak',
        stim: !!player.activeBuff
      }
    };
  }

  static simulateRounds(
    attacker: CombatAttackerSetup,
    defender: CombatDefenderSetup,
    roundCount: number = 50
  ): { logs: CombatRoundLog[]; summary: CombatSimulationSummary } {
    const weapon = (GEAR_CATALOG_DATA.weapon as any)[attacker.gear.weapon] || GEAR_CATALOG_DATA.weapon.rifle;
    const helm = (GEAR_CATALOG_DATA.helmet as any)[attacker.gear.helmet] || GEAR_CATALOG_DATA.helmet.blue;
    const ammo = (GEAR_CATALOG_DATA.ammo as any)[attacker.gear.ammo] || GEAR_CATALOG_DATA.ammo.standard;
    const gloves = (GEAR_CATALOG_DATA.gloves as any)[attacker.gear.gloves] || GEAR_CATALOG_DATA.gloves.blue;

    const baseAtk = (attacker.skills.attack * 2.8) + weapon.atk;
    const totalBonusMultiplier = 1 + (attacker.militaryRankBonus / 100) + (attacker.battleBonus / 100) + ammo.dmgBonus + (attacker.gear.stim ? 0.60 : 0);
    
    // Defender mitigation: Armor soft cap formula = armor / (armor + 150)
    const armorMitigationPct = defender.armor / (defender.armor + 160);
    const netDamageMultiplier = (1 - armorMitigationPct);

    const effectivePrecision = attacker.skills.precision + (gloves.prc || 0);
    const netDodgeChance = Math.max(0.03, Math.min(0.65, (defender.dodge - effectivePrecision * 0.4) / 100));

    const effectiveCritChance = Math.min(0.85, (attacker.skills.criticalChance + weapon.critc) / 100);
    const effectiveCritDamageMultiplier = (attacker.skills.criticalDamage + (helm.critd || 0)) / 100;

    let currentEnemyHp = defender.health;
    const logs: CombatRoundLog[] = [];
    let totalDamage = 0;
    let hitCount = 0;
    let critCount = 0;

    const ammoCostPerShot = ammo.costDaily ? (ammo.costDaily / 800) : 0;
    const durabilityCostPerRound = 0.085;

    for (let r = 1; r <= roundCount; r++) {
      const rollDodge = Math.random();
      const rollCrit = Math.random();

      let outcome: 'HIT' | 'CRIT' | 'DODGE' | 'GLANCE' = 'HIT';
      let dmg = 0;
      let logMsg = '';

      if (rollDodge < netDodgeChance) {
        outcome = 'DODGE';
        dmg = 0;
        logMsg = `Round ${r}: Target evaded your attack! (0 DMG)`;
      } else {
        hitCount++;
        // Base variance +/- 6%
        const variance = 0.94 + Math.random() * 0.12;
        const unmitigated = baseAtk * totalBonusMultiplier * variance;

        if (rollCrit < effectiveCritChance) {
          outcome = 'CRIT';
          critCount++;
          dmg = Math.round(unmitigated * effectiveCritDamageMultiplier * netDamageMultiplier);
          logMsg = `Round ${r}: CRITICAL HIT! Landed ${dmg.toLocaleString()} armor-piercing damage!`;
        } else {
          outcome = 'HIT';
          dmg = Math.round(unmitigated * netDamageMultiplier);
          logMsg = `Round ${r}: Direct hit dealt ${dmg.toLocaleString()} damage.`;
        }
      }

      totalDamage += dmg;
      currentEnemyHp = Math.max(0, currentEnemyHp - dmg);

      logs.push({
        round: r,
        outcome,
        damageDealt: dmg,
        enemyHealthRemaining: currentEnemyHp,
        ammoUsedCost: ammoCostPerShot,
        durabilityWearCost: durabilityCostPerRound,
        logMessage: logMsg
      });

      if (currentEnemyHp <= 0) {
        currentEnemyHp = defender.health; // reset HP pool if depleted for endless training
      }
    }

    const avgDamage = hitCount > 0 ? Math.round(totalDamage / roundCount) : 0;
    const critRate = roundCount > 0 ? (critCount / roundCount) * 100 : 0;
    const hitRate = roundCount > 0 ? (hitCount / roundCount) * 100 : 0;
    const dpe = Math.round(avgDamage * 10); // 10 hits per 100 energy

    const ammoTotal = ammoCostPerShot * roundCount;
    const duraTotal = durabilityCostPerRound * roundCount;
    const dailyHits = attacker.gear.stim ? (18 * 45) : (24 * 45); // 810 or 1080 hits
    const projectedDailyDamage = avgDamage * dailyHits;
    const projectedDailyCost = Math.round((ammoCostPerShot + durabilityCostPerRound) * dailyHits);
    const netCostPer1kDamage = projectedDailyDamage > 0 ? Number(((projectedDailyCost / (projectedDailyDamage / 1000))).toFixed(3)) : 0;
    const expectedDailyCases = Number(((dailyHits * (attacker.skills.lootChance / 100) * 0.45)).toFixed(1));

    return {
      logs,
      summary: {
        simulatedRounds: roundCount,
        totalDamage,
        avgDamagePerHit: avgDamage,
        critRateActual: Math.round(critRate * 10) / 10,
        hitRateActual: Math.round(hitRate * 10) / 10,
        damagePer100Energy: dpe,
        ammoCostTotal: Math.round(ammoTotal * 100) / 100,
        durabilityLossTotal: Math.round(duraTotal * 100) / 100,
        netCostPer1kDamage,
        projectedDailyDamage,
        projectedDailyCost,
        expectedDailyCases
      }
    };
  }
}
