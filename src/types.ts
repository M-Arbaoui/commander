/**
 * QASWARA — Domain Types and DTO Definitions
 * Follows strict technical architecture and verified War Era data models.
 */

export type Language = 'en' | 'ar';

export type AppRoute = 
  | 'home'
  | 'suggestions'
  | 'war'
  | 'build'
  | 'combat'
  | 'economy'
  | 'api-discovery'
  | 'settings'
  | 'players'
  | 'military-unit'
  | 'country';

export type BuildMode = 'soldier' | 'looter' | 'tycoon';

export interface CostFactorsConfig {
  cases: boolean;
  scrap: boolean;
  battleLoot: 'off' | 'single' | 'average';
  companies: boolean;
  work: boolean;
  employeeProfits: boolean;
}

export interface CompanyEngineSlot {
  id: number;
  tier: number; // 0 = Inactive, 1-7 = Engine tier
  name: string;
  dailyRevenue: number;
  dailyMaintenance: number;
}

export interface GearPinSelection {
  weapon: string; // 'any' | 'none' | 'knife' | 'gun' | 'rifle' | 'sniper' | 'tank' | 'jet'
  helmet: string; // 'any' | 'none' | 'grey' | 'green' | 'blue' | 'purple' | 'gold' | 'red'
  chest: string;
  pants: string;
  boots: string;
  gloves: string;
  ammo: string;   // 'any' | 'none' | 'light' | 'standard' | 'heavy'
  food: string;   // 'any' | 'none' | 'bread' | 'steak' | 'fish'
  stim: boolean;
}

export interface GeneratedBuildCard {
  id: string;
  name: string;
  mode: BuildMode;
  tag: string;
  isMaxDamage?: boolean;
  dailyDamage: number;
  dailyNetCost: number;
  costPer1kDamage: number;
  casesPerDay: number;
  totalSpInvested: number;
  totalPpInvested: number;
  gearSummary: {
    weapon: string;
    helmet: string;
    chest: string;
    pants: string;
    boots: string;
    gloves: string;
    ammo: string;
    food: string;
    stim: boolean;
  };
  skills: PlayerSkills;
  prestigeSkills: Record<string, number>;
  durabilityCostDaily: number;
  consumablesCostDaily: number;
  incomeBreakdown: {
    cases: number;
    scrap: number;
    companies: number;
    work: number;
    battleLoot: number;
    employeeProfits: number;
  };
}

export interface CombatRoundLog {
  round: number;
  outcome: 'HIT' | 'CRIT' | 'DODGE' | 'GLANCE';
  damageDealt: number;
  enemyHealthRemaining: number;
  ammoUsedCost: number;
  durabilityWearCost: number;
  logMessage: string;
}

export interface CombatSimulationSummary {
  simulatedRounds: number;
  totalDamage: number;
  avgDamagePerHit: number;
  critRateActual: number;
  hitRateActual: number;
  damagePer100Energy: number;
  ammoCostTotal: number;
  durabilityLossTotal: number;
  netCostPer1kDamage: number;
  projectedDailyDamage: number;
  projectedDailyCost: number;
  expectedDailyCases: number;
}

export type BuildObjective =
  | 'max_damage'
  | 'coin_efficiency'
  | 'balanced'
  | 'budget'
  | 'high_bonus'
  | 'war_preparation';

export type RecommendationVerdict =
  | 'Recommended'
  | 'Buy'
  | 'Wait'
  | 'Upgrade Something Else'
  | 'Avoid';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type EquipmentSlot =
  | 'weapon'
  | 'helmet'
  | 'chest'
  | 'pants'
  | 'boots'
  | 'gloves';

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  level: number;
  maxLevel: number;
  attackBonus: number;
  armorBonus: number;
  precisionBonus: number;
  critChanceBonus: number;
  critDamageBonus: number;
  dodgeBonus: number;
  upgradeCost: number;
  marketPrice?: number;
  artworkCode: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

export interface PlayerSkills {
  // Combat Skills
  attack: number;
  precision: number;
  criticalChance: number;
  criticalDamage: number;
  armor: number;
  dodge: number;
  health: number;
  lootChance: number;
  hunger: number;

  // Economic Skills
  entrepreneurship: number;
  energy: number;
  production: number;
  companiesLimit: number;
  management: number;
}

export interface PlayerDTO {
  id: string;
  username: string;
  level: number;
  country: string;
  countryCode: string;
  militaryUnit: string;
  militaryUnitId: string;
  muRank: string;
  coins: number;
  energy: number;
  maxEnergy: number;
  health: number;
  maxHealth: number;
  avatarUrl?: string;
  militaryRank?: number;
  totalDamages?: number;
  weeklyDamages?: number;
  activeBuff?: string;
  isLiveVerified?: boolean;
  lastFetchedAt?: string;
  unspentSkillPoints?: number;
  equipment: Record<EquipmentSlot, EquipmentItem>;
  skills: PlayerSkills;
  inventory: Array<{
    itemId: string;
    name: string;
    quantity: number;
    category: 'material' | 'consumable' | 'equipment';
  }>;
}

export interface WarBonusBreakdown {
  personalBonusPercent: number;
  militaryUnitBonusPercent: number;
  countryBonusPercent: number;
  specialPillsPercent: number;
  defensePactPercent: number;
  totalMultiplier: number;
  stackingMode: 'multiplicative' | 'additive';
  explanationFormula: string;
}

export interface WarDTO {
  id: string;
  title: string;
  type: 'Direct' | 'Resistance' | 'Defensive Pact';
  attackerCountry: string;
  attackerCountryCode: string;
  defenderCountry: string;
  defenderCountryCode: string;
  region: string;
  status: 'Active' | 'Preparation' | 'Ended';
  rounds: number;
  currentRound: number;
  timeRemainingMinutes: number;
  attackerScore: number;
  defenderScore: number;
  isPlayerCountryInvolved: boolean;
  playerSide: 'Attacker' | 'Defender' | 'Neutral';
  baseDamagePerHit: number;
  estimatedTotalDamage: number;
  estimatedCoinsCost: number;
  bonuses: WarBonusBreakdown;
}

export interface DecisionCardData {
  id: string;
  title: string;
  verdict: RecommendationVerdict;
  expectedResult: string;
  cost: string;
  costNumber: number;
  reason: string;
  tradeOffs?: string;
  actionText: string;
  confidence: ConfidenceLevel;
  category: 'build' | 'war' | 'economy' | 'skills';
  details?: string[];
  efficiencyScore?: number;
}

export interface MarketPurchaseItem {
  id: string;
  name: string;
  slot?: EquipmentSlot;
  category: 'Equipment' | 'Consumable' | 'Raw Material' | 'Pill';
  price: number;
  avgHistoricalPrice: number;
  priceTrendPercent: number;
  expectedGain: string;
  gainValueNumeric: number;
  efficiency: number; // gain / cost
  verdict: RecommendationVerdict;
  reason: string;
  opportunityCost: string;
  paybackTimeHours?: number;
  confidence: ConfidenceLevel;
}

export interface ApiEndpointDoc {
  id: string;
  category: 'User' | 'Battles' | 'Market' | 'Country' | 'Military Unit' | 'Company' | 'Gateway';
  method: 'GET' | 'POST';
  path: string;
  procedure: string;
  gatewayCached: boolean;
  cacheTtlSeconds?: number;
  description: string;
  authRequired: boolean;
  rateLimit: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responseFields: Array<{
    field: string;
    type: string;
    verified: 'Verified' | 'Partially documented' | 'Unknown';
    notes: string;
  }>;
  exampleResponse: string;
}

export interface GeminiNextBestAction {
  title: string;
  category: 'gear' | 'skill' | 'economy' | 'combat';
  why: string;
  expectedImpact: string;
  actionSteps: string;
  tip?: string;
}
