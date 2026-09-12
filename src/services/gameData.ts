import { PlayerDTO, WarDTO, MarketPurchaseItem, EquipmentSlot, EquipmentItem } from '../types';

export const INITIAL_PLAYER_HANDLE = 'MOUHAB';

export const BASE_EQUIPMENT_CATALOG: Record<EquipmentSlot, EquipmentItem[]> = {
  weapon: [
    {
      id: 'eq_wp_q1',
      name: 'Standard Infantry Rifle (Q1)',
      slot: 'weapon',
      level: 1,
      maxLevel: 5,
      attackBonus: 120,
      armorBonus: 0,
      precisionBonus: 15,
      critChanceBonus: 0.05,
      critDamageBonus: 0.20,
      dodgeBonus: 0,
      upgradeCost: 400,
      artworkCode: 'rifle_q1',
      rarity: 'Common'
    },
    {
      id: 'eq_wp_q3',
      name: 'Vanguard Assault Carbine (Q3)',
      slot: 'weapon',
      level: 3,
      maxLevel: 5,
      attackBonus: 280,
      armorBonus: 0,
      precisionBonus: 35,
      critChanceBonus: 0.12,
      critDamageBonus: 0.45,
      dodgeBonus: 0,
      upgradeCost: 1250,
      artworkCode: 'rifle_q3',
      rarity: 'Rare'
    },
    {
      id: 'eq_wp_q5',
      name: 'Titanium Sniper Rifle (Q5)',
      slot: 'weapon',
      level: 5,
      maxLevel: 5,
      attackBonus: 540,
      armorBonus: 0,
      precisionBonus: 75,
      critChanceBonus: 0.25,
      critDamageBonus: 0.85,
      dodgeBonus: 0,
      upgradeCost: 3200,
      artworkCode: 'rifle_q5',
      rarity: 'Legendary'
    }
  ],
  helmet: [
    {
      id: 'eq_hl_q2',
      name: 'Reinforced Ballistic Helmet (Q2)',
      slot: 'helmet',
      level: 2,
      maxLevel: 5,
      attackBonus: 15,
      armorBonus: 85,
      precisionBonus: 10,
      critChanceBonus: 0.02,
      critDamageBonus: 0.05,
      dodgeBonus: 0.03,
      upgradeCost: 650,
      artworkCode: 'helmet_q2',
      rarity: 'Uncommon'
    },
    {
      id: 'eq_hl_q4',
      name: 'Composite Tactical Helmet (Q4)',
      slot: 'helmet',
      level: 4,
      maxLevel: 5,
      attackBonus: 40,
      armorBonus: 190,
      precisionBonus: 25,
      critChanceBonus: 0.06,
      critDamageBonus: 0.15,
      dodgeBonus: 0.07,
      upgradeCost: 1800,
      artworkCode: 'helmet_q4',
      rarity: 'Epic'
    }
  ],
  chest: [
    {
      id: 'eq_ch_q2',
      name: 'Kevlar Tactical Vest (Q2)',
      slot: 'chest',
      level: 2,
      maxLevel: 5,
      attackBonus: 0,
      armorBonus: 160,
      precisionBonus: 0,
      critChanceBonus: 0,
      critDamageBonus: 0,
      dodgeBonus: 0.02,
      upgradeCost: 900,
      artworkCode: 'chest_q2',
      rarity: 'Uncommon'
    },
    {
      id: 'eq_ch_q3',
      name: 'Heavy Ceramic Plate Carrier (Q3)',
      slot: 'chest',
      level: 3,
      maxLevel: 5,
      attackBonus: 0,
      armorBonus: 290,
      precisionBonus: 0,
      critChanceBonus: 0,
      critDamageBonus: 0,
      dodgeBonus: 0.04,
      upgradeCost: 1650,
      artworkCode: 'chest_q3',
      rarity: 'Rare'
    }
  ],
  pants: [
    {
      id: 'eq_pt_q2',
      name: 'Combat Utility Trousers (Q2)',
      slot: 'pants',
      level: 2,
      maxLevel: 5,
      attackBonus: 10,
      armorBonus: 70,
      precisionBonus: 5,
      critChanceBonus: 0.02,
      critDamageBonus: 0,
      dodgeBonus: 0.04,
      upgradeCost: 550,
      artworkCode: 'pants_q2',
      rarity: 'Uncommon'
    }
  ],
  boots: [
    {
      id: 'eq_bt_q2',
      name: 'Steel-Toe Tactical Boots (Q2)',
      slot: 'boots',
      level: 2,
      maxLevel: 5,
      attackBonus: 20,
      armorBonus: 60,
      precisionBonus: 0,
      critChanceBonus: 0,
      critDamageBonus: 0,
      dodgeBonus: 0.06,
      upgradeCost: 600,
      artworkCode: 'boots_q2',
      rarity: 'Uncommon'
    }
  ],
  gloves: [
    {
      id: 'eq_gl_q2',
      name: 'Tactical Grip Combat Gloves (Q2)',
      slot: 'gloves',
      level: 2,
      maxLevel: 5,
      attackBonus: 45,
      armorBonus: 35,
      precisionBonus: 28,
      critChanceBonus: 0.05,
      critDamageBonus: 0.12,
      dodgeBonus: 0.02,
      upgradeCost: 840,
      artworkCode: 'gloves_q2',
      rarity: 'Uncommon'
    },
    {
      id: 'eq_gl_q3',
      name: 'Reinforced Mechanized Gloves (Q3)',
      slot: 'gloves',
      level: 3,
      maxLevel: 5,
      attackBonus: 95,
      armorBonus: 65,
      precisionBonus: 48,
      critChanceBonus: 0.09,
      critDamageBonus: 0.22,
      dodgeBonus: 0.04,
      upgradeCost: 1450,
      artworkCode: 'gloves_q3',
      rarity: 'Rare'
    }
  ]
};

export const DEFAULT_PLAYER_PROFILE: PlayerDTO = {
  id: '69d8b492f5419ebd5b851561',
  username: 'MOUHAB',
  level: 37,
  country: 'Senegal',
  countryCode: 'SN',
  militaryUnit: 'THE ROYAL ARMY',
  militaryUnitId: '6aa2a0432cff7c0847b0fd62',
  muRank: 'Rank 84',
  coins: 11265,
  energy: 30,
  maxEnergy: 30,
  health: 140,
  maxHealth: 140,
  avatarUrl: 'https://media.warera.io/avatars/69d8b492f5419ebd5b851561-1788975265691-5hjad3yb.jpg',
  militaryRank: 84,
  totalDamages: 34883031,
  weeklyDamages: 2098862,
  activeBuff: 'Combat Stim (+60% DMG)',
  isLiveVerified: true,
  lastFetchedAt: 'Synced from API',
  equipment: {
    weapon: {
      ...BASE_EQUIPMENT_CATALOG.weapon[1],
      name: 'Vanguard Assault Rifle (Q3)',
      attackBonus: 55,
      critChanceBonus: 0.10
    },
    helmet: {
      ...BASE_EQUIPMENT_CATALOG.helmet[0],
      name: 'Reinforced Ballistic Helmet (Q2)',
      critDamageBonus: 0.76
    },
    chest: {
      ...BASE_EQUIPMENT_CATALOG.chest[0],
      name: 'Tactical Plate Vest (Q2)',
      armorBonus: 60
    },
    pants: {
      ...BASE_EQUIPMENT_CATALOG.pants[0],
      name: 'Reinforced Combat Pants (Q2)',
      armorBonus: 24
    },
    boots: {
      ...BASE_EQUIPMENT_CATALOG.boots[0],
      name: 'Standard Combat Boots (Q2)',
      dodgeBonus: 0.22
    },
    gloves: {
      ...BASE_EQUIPMENT_CATALOG.gloves[0],
      name: 'Tactical Grip Gloves (Q2)',
      precisionBonus: 23
    }
  },
  skills: {
    attack: 275,
    precision: 75,
    criticalChance: 35,
    criticalDamage: 200,
    armor: 24,
    dodge: 16,
    health: 140,
    lootChance: 19,
    hunger: 7,
    entrepreneurship: 35,
    energy: 30,
    production: 10,
    companiesLimit: 6,
    management: 4
  },
  inventory: [
    { itemId: 'ammo_q5', name: 'Armor-Piercing Ammunition (Q5)', quantity: 240, category: 'consumable' },
    { itemId: 'bread_q5', name: 'Combat Ration Bread (Q5)', quantity: 45, category: 'consumable' },
    { itemId: 'combat_pill_60', name: 'Combat Stim Pill (+60% DMG)', quantity: 2, category: 'consumable' },
    { itemId: 'raw_steel', name: 'Refined Steel Ingot', quantity: 180, category: 'material' }
  ]
};

export const VERIFIED_WARS_LIST: WarDTO[] = [
  {
    id: 'war_gibraltar_7811',
    title: 'Strait of Gibraltar Campaign — Round 4',
    type: 'Direct',
    attackerCountry: 'Morocco',
    attackerCountryCode: 'MAR',
    defenderCountry: 'Spain',
    defenderCountryCode: 'ESP',
    region: 'Gibraltar Strait',
    status: 'Active',
    rounds: 7,
    currentRound: 4,
    timeRemainingMinutes: 48,
    attackerScore: 1250,
    defenderScore: 980,
    isPlayerCountryInvolved: true,
    playerSide: 'Attacker',
    baseDamagePerHit: 1420,
    estimatedTotalDamage: 124800,
    estimatedCoinsCost: 680,
    bonuses: {
      personalBonusPercent: 12,
      militaryUnitBonusPercent: 14,
      countryBonusPercent: 10,
      specialPillsPercent: 60,
      defensePactPercent: 5,
      totalMultiplier: 2.18,
      stackingMode: 'multiplicative',
      explanationFormula: '(1 + 0.12) * (1 + 0.14) * (1 + 0.10) * (1 + 0.05) * (1 + 0.60)'
    }
  },
  {
    id: 'war_balkans_902',
    title: 'Northern Adriatic Liberation',
    type: 'Resistance',
    attackerCountry: 'Croatia',
    attackerCountryCode: 'HRV',
    defenderCountry: 'Italy',
    defenderCountryCode: 'ITA',
    region: 'Istria Peninsula',
    status: 'Active',
    rounds: 5,
    currentRound: 2,
    timeRemainingMinutes: 112,
    attackerScore: 620,
    defenderScore: 780,
    isPlayerCountryInvolved: false,
    playerSide: 'Neutral',
    baseDamagePerHit: 1420,
    estimatedTotalDamage: 88200,
    estimatedCoinsCost: 520,
    bonuses: {
      personalBonusPercent: 12,
      militaryUnitBonusPercent: 0,
      countryBonusPercent: 0,
      specialPillsPercent: 0,
      defensePactPercent: 0,
      totalMultiplier: 1.12,
      stackingMode: 'multiplicative',
      explanationFormula: '(1 + 0.12) [Neutral battle: no MU or country order applied]'
    }
  },
  {
    id: 'war_rhine_414',
    title: 'Lower Rhine Sector Defense',
    type: 'Defensive Pact',
    attackerCountry: 'Germany',
    attackerCountryCode: 'DEU',
    defenderCountry: 'France',
    defenderCountryCode: 'FRA',
    region: 'Alsace Border',
    status: 'Preparation',
    rounds: 8,
    currentRound: 1,
    timeRemainingMinutes: 240,
    attackerScore: 0,
    defenderScore: 0,
    isPlayerCountryInvolved: false,
    playerSide: 'Neutral',
    baseDamagePerHit: 1420,
    estimatedTotalDamage: 92400,
    estimatedCoinsCost: 610,
    bonuses: {
      personalBonusPercent: 12,
      militaryUnitBonusPercent: 0,
      countryBonusPercent: 0,
      specialPillsPercent: 0,
      defensePactPercent: 0,
      totalMultiplier: 1.12,
      stackingMode: 'multiplicative',
      explanationFormula: '(1 + 0.12)'
    }
  }
];

export const VERIFIED_MARKET_ITEMS: MarketPurchaseItem[] = [
  {
    id: 'mkt_gl_q3',
    name: 'Reinforced Mechanized Gloves (Q3 Upgrade)',
    slot: 'gloves',
    category: 'Equipment',
    price: 840,
    avgHistoricalPrice: 910,
    priceTrendPercent: -7.6,
    expectedGain: '+8.7% expected combat damage & +20 Precision',
    gainValueNumeric: 8.7,
    efficiency: 0.01035, // 8.7 / 840
    verdict: 'Buy',
    reason: 'Highest damage increase per coin spent across your currently affordable upgrades.',
    opportunityCost: 'Postpones Helmet Q4 purchase by 1-2 days of company work wages.',
    confidence: 'High'
  },
  {
    id: 'mkt_pill_60',
    name: 'Combat Stim Damage Pill (+60% DMG, 8h)',
    category: 'Pill',
    price: 850,
    avgHistoricalPrice: 840,
    priceTrendPercent: +1.2,
    expectedGain: '+60.0% multiplicative battle damage for 8 hours',
    gainValueNumeric: 60.0,
    efficiency: 0.0705,
    verdict: 'Buy',
    reason: 'Crucial multiplier during active Gibraltar Round 4; covers potential Hero medal coin bounty.',
    opportunityCost: 'Liquidates 25% of current coin balance; use only when actively fighting top rounds.',
    confidence: 'High'
  },
  {
    id: 'mkt_hl_q4',
    name: 'Composite Tactical Helmet (Q4)',
    slot: 'helmet',
    category: 'Equipment',
    price: 1800,
    avgHistoricalPrice: 1750,
    priceTrendPercent: +2.8,
    expectedGain: '+4.2% expected damage & +105 Armor',
    gainValueNumeric: 4.2,
    efficiency: 0.00233, // 4.2 / 1800
    verdict: 'Wait',
    reason: 'Cost is high relative to the modest 4.2% damage increment. Upgrade Gloves first.',
    opportunityCost: 'Consumes over 52% of your liquid coins with lower marginal gain than weapon or gloves.',
    confidence: 'High'
  },
  {
    id: 'mkt_wp_q5',
    name: 'Titanium Sniper Rifle (Q5 Legendary)',
    slot: 'weapon',
    category: 'Equipment',
    price: 3200,
    avgHistoricalPrice: 3400,
    priceTrendPercent: -5.8,
    expectedGain: '+24.5% massive raw damage spike',
    gainValueNumeric: 24.5,
    efficiency: 0.00765,
    verdict: 'Upgrade Something Else',
    reason: 'High absolute gain, but buying Gloves Q3 + keeping Ammo reserves provides superior sustainability.',
    opportunityCost: 'Leaves your balance below 250 coins, risking inability to buy ammo or food.',
    confidence: 'Medium'
  },
  {
    id: 'mkt_res_q1',
    name: 'Combat Skill Points Reset Voucher',
    category: 'Consumable',
    price: 1200,
    avgHistoricalPrice: 1200,
    priceTrendPercent: 0,
    expectedGain: 'Reallocate 160 combat skill points',
    gainValueNumeric: 1.5,
    efficiency: 0.00125,
    verdict: 'Avoid',
    reason: 'Current combat distribution (Attack 34 / Precision 26 / Crit 18) is already within 94% of optimal parity. A reset wastes 1200 coins.',
    opportunityCost: 'Completely eliminates reserve funds without measurable combat damage lift.',
    confidence: 'High'
  }
];

/**
 * ============================================================================
 * War Era Asset Library Mapping Utility
 * Links equipment IDs, item codes, and slot types to their official War Era images.
 * ============================================================================
 */

export type ItemQualityTier = 'grey' | 'green' | 'blue' | 'purple' | 'gold' | 'red' | 'none';

export interface EquipmentAssetMeta {
  id: string;
  imageFileName: string;
  imagePath: string; // Absolute path to the local asset (e.g. '/assets/items/rifle.png')
  cdnUrl: string;    // Fallback official wiki CDN URL (e.g. 'https://intel.warera.wiki/assets/rifle.png')
  slot?: EquipmentSlot | 'consumable' | 'material' | 'special';
  quality: ItemQualityTier;
  label: string;
}

/**
 * Direct mapping of equipment item IDs to their corresponding War Era asset images and metadata.
 */
export const EQUIPMENT_ID_IMAGE_MAP: Record<string, EquipmentAssetMeta> = {
  // --- Weapon Equipment IDs ---
  eq_wp_q1: { id: 'eq_wp_q1', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'grey', label: 'Standard Infantry Rifle (Q1)' },
  eq_wp_q2: { id: 'eq_wp_q2', imageFileName: 'gun.png', imagePath: '/assets/items/gun.png', cdnUrl: 'https://intel.warera.wiki/assets/gun.png', slot: 'weapon', quality: 'green', label: 'Sidearm Pistol (Q2)' },
  eq_wp_q3: { id: 'eq_wp_q3', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'blue', label: 'Vanguard Assault Carbine (Q3)' },
  eq_wp_q4: { id: 'eq_wp_q4', imageFileName: 'sniper.png', imagePath: '/assets/items/sniper.png', cdnUrl: 'https://intel.warera.wiki/assets/sniper.png', slot: 'weapon', quality: 'purple', label: 'Precision Sniper (Q4)' },
  eq_wp_q5: { id: 'eq_wp_q5', imageFileName: 'tank.png', imagePath: '/assets/items/tank.png', cdnUrl: 'https://intel.warera.wiki/assets/tank.png', slot: 'weapon', quality: 'gold', label: 'Titanium Sniper / Tank (Q5)' },
  eq_wp_q6: { id: 'eq_wp_q6', imageFileName: 'jet.png', imagePath: '/assets/items/jet.png', cdnUrl: 'https://intel.warera.wiki/assets/jet.png', slot: 'weapon', quality: 'red', label: 'Stealth Jet (Q6)' },

  // --- Helmet Equipment IDs ---
  eq_hl_q1: { id: 'eq_hl_q1', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'grey', label: 'Grey Cap (Q1)' },
  eq_hl_q2: { id: 'eq_hl_q2', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'green', label: 'Reinforced Ballistic Helmet (Q2)' },
  eq_hl_q3: { id: 'eq_hl_q3', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'blue', label: 'Blue Spec Helmet (Q3)' },
  eq_hl_q4: { id: 'eq_hl_q4', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'purple', label: 'Composite Tactical Helmet (Q4)' },
  eq_hl_q5: { id: 'eq_hl_q5', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'gold', label: 'Gold Ballistic Helmet (Q5)' },
  eq_hl_q6: { id: 'eq_hl_q6', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'red', label: 'Mythic Red Visor (Q6)' },

  // --- Chest Armor Equipment IDs ---
  eq_ch_q1: { id: 'eq_ch_q1', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'grey', label: 'Grey Vest (Q1)' },
  eq_ch_q2: { id: 'eq_ch_q2', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'green', label: 'Kevlar Tactical Vest (Q2)' },
  eq_ch_q3: { id: 'eq_ch_q3', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'blue', label: 'Heavy Ceramic Plate Carrier (Q3)' },
  eq_ch_q4: { id: 'eq_ch_q4', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'purple', label: 'Purple Tactical Cuirass (Q4)' },
  eq_ch_q5: { id: 'eq_ch_q5', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'gold', label: 'Gold Heavy Plate (Q5)' },
  eq_ch_q6: { id: 'eq_ch_q6', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'red', label: 'Mythic Exoskeleton Armor (Q6)' },

  // --- Pants Equipment IDs ---
  eq_pt_q1: { id: 'eq_pt_q1', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'grey', label: 'Grey Utility Pants (Q1)' },
  eq_pt_q2: { id: 'eq_pt_q2', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'green', label: 'Combat Utility Trousers (Q2)' },
  eq_pt_q3: { id: 'eq_pt_q3', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'blue', label: 'Blue Tactical Pants (Q3)' },
  eq_pt_q4: { id: 'eq_pt_q4', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'purple', label: 'Purple Spec Pants (Q4)' },
  eq_pt_q5: { id: 'eq_pt_q5', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'gold', label: 'Gold Reinforced Greaves (Q5)' },
  eq_pt_q6: { id: 'eq_pt_q6', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'red', label: 'Mythic Combat Greaves (Q6)' },

  // --- Boots Equipment IDs ---
  eq_bt_q1: { id: 'eq_bt_q1', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'grey', label: 'Grey Work Boots (Q1)' },
  eq_bt_q2: { id: 'eq_bt_q2', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'green', label: 'Steel-Toe Tactical Boots (Q2)' },
  eq_bt_q3: { id: 'eq_bt_q3', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'blue', label: 'Blue Assault Boots (Q3)' },
  eq_bt_q4: { id: 'eq_bt_q4', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'purple', label: 'Purple Spec Boots (Q4)' },
  eq_bt_q5: { id: 'eq_bt_q5', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'gold', label: 'Gold Heavy Sabatons (Q5)' },
  eq_bt_q6: { id: 'eq_bt_q6', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'red', label: 'Mythic Jet Boots (Q6)' },

  // --- Gloves Equipment IDs ---
  eq_gl_q1: { id: 'eq_gl_q1', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'grey', label: 'Grey Grip Gloves (Q1)' },
  eq_gl_q2: { id: 'eq_gl_q2', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'green', label: 'Tactical Grip Combat Gloves (Q2)' },
  eq_gl_q3: { id: 'eq_gl_q3', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'blue', label: 'Reinforced Mechanized Gloves (Q3)' },
  eq_gl_q4: { id: 'eq_gl_q4', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'purple', label: 'Purple Sniper Gloves (Q4)' },
  eq_gl_q5: { id: 'eq_gl_q5', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'gold', label: 'Gold Power Gauntlets (Q5)' },
  eq_gl_q6: { id: 'eq_gl_q6', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'red', label: 'Mythic Exoskeleton Gauntlets (Q6)' },

  // --- Artwork Code Fallbacks ---
  rifle_q1: { id: 'rifle_q1', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'grey', label: 'Infantry Rifle Q1' },
  rifle_q3: { id: 'rifle_q3', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'blue', label: 'Assault Carbine Q3' },
  rifle_q5: { id: 'rifle_q5', imageFileName: 'sniper.png', imagePath: '/assets/items/sniper.png', cdnUrl: 'https://intel.warera.wiki/assets/sniper.png', slot: 'weapon', quality: 'gold', label: 'Titanium Rifle Q5' },
  helmet_q2: { id: 'helmet_q2', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'green', label: 'Ballistic Helmet Q2' },
  helmet_q4: { id: 'helmet_q4', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'purple', label: 'Tactical Helmet Q4' },
  chest_q2: { id: 'chest_q2', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'green', label: 'Tactical Vest Q2' },
  chest_q3: { id: 'chest_q3', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'blue', label: 'Plate Carrier Q3' },
  pants_q2: { id: 'pants_q2', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'green', label: 'Combat Pants Q2' },
  boots_q2: { id: 'boots_q2', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'green', label: 'Tactical Boots Q2' },
  gloves_q2: { id: 'gloves_q2', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'green', label: 'Grip Gloves Q2' },
  gloves_q3: { id: 'gloves_q3', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'blue', label: 'Mechanized Gloves Q3' },

  // --- In-Game Item Key Identifiers ---
  knife: { id: 'knife', imageFileName: 'knife.png', imagePath: '/assets/items/knife.png', cdnUrl: 'https://intel.warera.wiki/assets/knife.png', slot: 'weapon', quality: 'grey', label: 'Combat Knife' },
  gun: { id: 'gun', imageFileName: 'gun.png', imagePath: '/assets/items/gun.png', cdnUrl: 'https://intel.warera.wiki/assets/gun.png', slot: 'weapon', quality: 'green', label: 'Sidearm Pistol' },
  rifle: { id: 'rifle', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'blue', label: 'Assault Rifle' },
  sniper: { id: 'sniper', imageFileName: 'sniper.png', imagePath: '/assets/items/sniper.png', cdnUrl: 'https://intel.warera.wiki/assets/sniper.png', slot: 'weapon', quality: 'purple', label: 'Precision Sniper Rifle' },
  tank: { id: 'tank', imageFileName: 'tank.png', imagePath: '/assets/items/tank.png', cdnUrl: 'https://intel.warera.wiki/assets/tank.png', slot: 'weapon', quality: 'gold', label: 'Armored Tank' },
  jet: { id: 'jet', imageFileName: 'jet.png', imagePath: '/assets/items/jet.png', cdnUrl: 'https://intel.warera.wiki/assets/jet.png', slot: 'weapon', quality: 'red', label: 'Stealth Jet' },

  // Slot-level fallbacks
  weapon: { id: 'weapon', imageFileName: 'rifle.png', imagePath: '/assets/items/rifle.png', cdnUrl: 'https://intel.warera.wiki/assets/rifle.png', slot: 'weapon', quality: 'blue', label: 'Weapon' },
  helmet: { id: 'helmet', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'green', label: 'Helmet' },
  chest: { id: 'chest', imageFileName: 'chest.png', imagePath: '/assets/items/chest.png', cdnUrl: 'https://intel.warera.wiki/assets/chest.png', slot: 'chest', quality: 'blue', label: 'Chest Armor' },
  pants: { id: 'pants', imageFileName: 'pants.png', imagePath: '/assets/items/pants.png', cdnUrl: 'https://intel.warera.wiki/assets/pants.png', slot: 'pants', quality: 'green', label: 'Combat Pants' },
  boots: { id: 'boots', imageFileName: 'boots.png', imagePath: '/assets/items/boots.png', cdnUrl: 'https://intel.warera.wiki/assets/boots.png', slot: 'boots', quality: 'green', label: 'Combat Boots' },
  gloves: { id: 'gloves', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'blue', label: 'Tactical Gloves' },

  // --- Consumables & Ammunition ---
  ammo: { id: 'ammo', imageFileName: 'ammo.png', imagePath: '/assets/items/ammo.png', cdnUrl: 'https://intel.warera.wiki/assets/ammo.png', slot: 'consumable', quality: 'blue', label: 'Standard Ammunition' },
  ammo_q5: { id: 'ammo_q5', imageFileName: 'heavyAmmo.png', imagePath: '/assets/items/heavyAmmo.png', cdnUrl: 'https://intel.warera.wiki/assets/heavyAmmo.png', slot: 'consumable', quality: 'gold', label: 'Armor-Piercing Ammunition (Q5)' },
  lightAmmo: { id: 'lightAmmo', imageFileName: 'lightAmmo.png', imagePath: '/assets/items/lightAmmo.png', cdnUrl: 'https://intel.warera.wiki/assets/lightAmmo.png', slot: 'consumable', quality: 'green', label: 'Light Ammo (+10%)' },
  heavyAmmo: { id: 'heavyAmmo', imageFileName: 'heavyAmmo.png', imagePath: '/assets/items/heavyAmmo.png', cdnUrl: 'https://intel.warera.wiki/assets/heavyAmmo.png', slot: 'consumable', quality: 'purple', label: 'Heavy AP Ammo (+40%)' },
  bread: { id: 'bread', imageFileName: 'bread.png', imagePath: '/assets/items/bread.png', cdnUrl: 'https://intel.warera.wiki/assets/bread.png', slot: 'consumable', quality: 'grey', label: 'Ration Bread' },
  bread_q5: { id: 'bread_q5', imageFileName: 'bread.png', imagePath: '/assets/items/bread.png', cdnUrl: 'https://intel.warera.wiki/assets/bread.png', slot: 'consumable', quality: 'gold', label: 'Combat Ration Bread (Q5)' },
  steak: { id: 'steak', imageFileName: 'steak.png', imagePath: '/assets/items/steak.png', cdnUrl: 'https://intel.warera.wiki/assets/steak.png', slot: 'consumable', quality: 'green', label: 'Steak Provision' },
  cookedFish: { id: 'cookedFish', imageFileName: 'cookedFish.png', imagePath: '/assets/items/cookedFish.png', cdnUrl: 'https://intel.warera.wiki/assets/cookedFish.png', slot: 'consumable', quality: 'blue', label: 'Cooked Fish' },
  cocain: { id: 'cocain', imageFileName: 'cocain.png', imagePath: '/assets/items/cocain.png', cdnUrl: 'https://intel.warera.wiki/assets/cocain.png', slot: 'consumable', quality: 'gold', label: 'Combat Stim (+60% DMG)' },
  stim: { id: 'stim', imageFileName: 'cocain.png', imagePath: '/assets/items/cocain.png', cdnUrl: 'https://intel.warera.wiki/assets/cocain.png', slot: 'consumable', quality: 'gold', label: 'Combat Stim' },
  combat_pill_60: { id: 'combat_pill_60', imageFileName: 'cocain.png', imagePath: '/assets/items/cocain.png', cdnUrl: 'https://intel.warera.wiki/assets/cocain.png', slot: 'consumable', quality: 'gold', label: 'Combat Stim Pill (+60% DMG)' },

  // --- Materials & Cases ---
  scraps: { id: 'scraps', imageFileName: 'scraps.png', imagePath: '/assets/items/scraps.png', cdnUrl: 'https://intel.warera.wiki/assets/scraps.png', slot: 'material', quality: 'none', label: 'Gear Scrap' },
  case1: { id: 'case1', imageFileName: 'case1.png', imagePath: '/assets/items/case1.png', cdnUrl: 'https://intel.warera.wiki/assets/case1.png', slot: 'special', quality: 'blue', label: 'Combat Loot Case' },
  case2: { id: 'case2', imageFileName: 'case2.png', imagePath: '/assets/items/case2.png', cdnUrl: 'https://intel.warera.wiki/assets/case2.png', slot: 'special', quality: 'gold', label: 'Elite Trophy Case' },
  raw_steel: { id: 'raw_steel', imageFileName: 'steel.png', imagePath: '/assets/items/steel.png', cdnUrl: 'https://intel.warera.wiki/assets/steel.png', slot: 'material', quality: 'blue', label: 'Refined Steel Ingot' },
  iron: { id: 'iron', imageFileName: 'iron.png', imagePath: '/assets/items/iron.png', cdnUrl: 'https://intel.warera.wiki/assets/iron.png', slot: 'material', quality: 'grey', label: 'Iron Ore' },
  steel: { id: 'steel', imageFileName: 'steel.png', imagePath: '/assets/items/steel.png', cdnUrl: 'https://intel.warera.wiki/assets/steel.png', slot: 'material', quality: 'blue', label: 'Steel' },
  oil: { id: 'oil', imageFileName: 'oil.png', imagePath: '/assets/items/oil.png', cdnUrl: 'https://intel.warera.wiki/assets/oil.png', slot: 'material', quality: 'green', label: 'Crude Oil' },
  wood: { id: 'wood', imageFileName: 'wood.png', imagePath: '/assets/items/wood.png', cdnUrl: 'https://intel.warera.wiki/assets/wood.png', slot: 'material', quality: 'grey', label: 'Lumber Wood' },

  // --- Market Items ---
  mkt_gl_q3: { id: 'mkt_gl_q3', imageFileName: 'gloves.png', imagePath: '/assets/items/gloves.png', cdnUrl: 'https://intel.warera.wiki/assets/gloves.png', slot: 'gloves', quality: 'blue', label: 'Reinforced Mechanized Gloves (Q3)' },
  mkt_pill_60: { id: 'mkt_pill_60', imageFileName: 'cocain.png', imagePath: '/assets/items/cocain.png', cdnUrl: 'https://intel.warera.wiki/assets/cocain.png', slot: 'consumable', quality: 'gold', label: 'Combat Stim Damage Pill (+60%)' },
  mkt_hl_q4: { id: 'mkt_hl_q4', imageFileName: 'helmet.png', imagePath: '/assets/items/helmet.png', cdnUrl: 'https://intel.warera.wiki/assets/helmet.png', slot: 'helmet', quality: 'purple', label: 'Composite Tactical Helmet (Q4)' },
  mkt_wp_q5: { id: 'mkt_wp_q5', imageFileName: 'sniper.png', imagePath: '/assets/items/sniper.png', cdnUrl: 'https://intel.warera.wiki/assets/sniper.png', slot: 'weapon', quality: 'gold', label: 'Titanium Sniper Rifle (Q5)' },
  mkt_res_q1: { id: 'mkt_res_q1', imageFileName: 'case1.png', imagePath: '/assets/items/case1.png', cdnUrl: 'https://intel.warera.wiki/assets/case1.png', slot: 'special', quality: 'blue', label: 'Skill Reset Voucher' }
};

/**
 * Resolves any equipment ID, item code, or slot name to its official War Era asset metadata.
 * Uses smart heuristic fallbacks if an exact ID isn't directly matched.
 */
export function getEquipmentAsset(idOrCodeOrSlot: string, slot?: EquipmentSlot): EquipmentAssetMeta {
  if (!idOrCodeOrSlot) {
    const fallbackSlot = slot || 'chest';
    return {
      id: fallbackSlot,
      imageFileName: `${fallbackSlot}.png`,
      imagePath: `/assets/items/${fallbackSlot}.png`,
      cdnUrl: `https://intel.warera.wiki/assets/${fallbackSlot}.png`,
      slot: fallbackSlot,
      quality: 'none',
      label: fallbackSlot
    };
  }

  // 1. Direct match by ID
  if (EQUIPMENT_ID_IMAGE_MAP[idOrCodeOrSlot]) {
    return EQUIPMENT_ID_IMAGE_MAP[idOrCodeOrSlot];
  }

  // 2. Normalize and check lower-case / stripped match
  const lower = idOrCodeOrSlot.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (EQUIPMENT_ID_IMAGE_MAP[lower]) {
    return EQUIPMENT_ID_IMAGE_MAP[lower];
  }

  // 3. Keyword heuristic match
  let imageFileName = 'chest.png';
  let quality: ItemQualityTier = 'grey';
  let resolvedSlot: EquipmentSlot | 'consumable' | 'material' | 'special' = slot || 'chest';

  if (lower.includes('knife')) {
    imageFileName = 'knife.png';
    quality = 'grey';
    resolvedSlot = 'weapon';
  } else if (lower.includes('gun') || lower.includes('pistol')) {
    imageFileName = 'gun.png';
    quality = 'green';
    resolvedSlot = 'weapon';
  } else if (lower.includes('sniper')) {
    imageFileName = 'sniper.png';
    quality = 'purple';
    resolvedSlot = 'weapon';
  } else if (lower.includes('tank')) {
    imageFileName = 'tank.png';
    quality = 'gold';
    resolvedSlot = 'weapon';
  } else if (lower.includes('jet')) {
    imageFileName = 'jet.png';
    quality = 'red';
    resolvedSlot = 'weapon';
  } else if (lower.includes('rifle') || lower.includes('carbine') || resolvedSlot === 'weapon') {
    imageFileName = 'rifle.png';
    quality = 'blue';
    resolvedSlot = 'weapon';
  } else if (lower.includes('helmet') || lower.includes('visor') || lower.includes('cap') || resolvedSlot === 'helmet') {
    imageFileName = 'helmet.png';
    resolvedSlot = 'helmet';
  } else if (lower.includes('chest') || lower.includes('vest') || lower.includes('cuirass') || lower.includes('plate') || resolvedSlot === 'chest') {
    imageFileName = 'chest.png';
    resolvedSlot = 'chest';
  } else if (lower.includes('pant') || lower.includes('trousers') || lower.includes('greaves') || resolvedSlot === 'pants') {
    imageFileName = 'pants.png';
    resolvedSlot = 'pants';
  } else if (lower.includes('boot') || lower.includes('shoe') || lower.includes('sabaton') || lower.includes('strider') || resolvedSlot === 'boots') {
    imageFileName = 'boots.png';
    resolvedSlot = 'boots';
  } else if (lower.includes('glove') || lower.includes('gauntlet') || lower.includes('grip') || resolvedSlot === 'gloves') {
    imageFileName = 'gloves.png';
    resolvedSlot = 'gloves';
  } else if (lower.includes('heavy') && lower.includes('ammo')) {
    imageFileName = 'heavyAmmo.png';
    quality = 'purple';
    resolvedSlot = 'consumable';
  } else if (lower.includes('light') && lower.includes('ammo')) {
    imageFileName = 'lightAmmo.png';
    quality = 'green';
    resolvedSlot = 'consumable';
  } else if (lower.includes('ammo')) {
    imageFileName = 'ammo.png';
    quality = 'blue';
    resolvedSlot = 'consumable';
  } else if (lower.includes('bread')) {
    imageFileName = 'bread.png';
    quality = 'grey';
    resolvedSlot = 'consumable';
  } else if (lower.includes('steak') || lower.includes('meat')) {
    imageFileName = 'steak.png';
    quality = 'green';
    resolvedSlot = 'consumable';
  } else if (lower.includes('fish')) {
    imageFileName = 'cookedFish.png';
    quality = 'blue';
    resolvedSlot = 'consumable';
  } else if (lower.includes('stim') || lower.includes('pill') || lower.includes('cocain')) {
    imageFileName = 'cocain.png';
    quality = 'gold';
    resolvedSlot = 'consumable';
  } else if (lower.includes('scrap')) {
    imageFileName = 'scraps.png';
    quality = 'none';
    resolvedSlot = 'material';
  } else if (lower.includes('case2')) {
    imageFileName = 'case2.png';
    quality = 'gold';
    resolvedSlot = 'special';
  } else if (lower.includes('case')) {
    imageFileName = 'case1.png';
    quality = 'blue';
    resolvedSlot = 'special';
  }

  // Quality override if Q1-Q6 or rarity words are present
  if (lower.includes('q1') || lower.includes('common') || lower.includes('grey')) quality = 'grey';
  else if (lower.includes('q2') || lower.includes('uncommon') || lower.includes('green')) quality = 'green';
  else if (lower.includes('q3') || lower.includes('rare') || lower.includes('blue')) quality = 'blue';
  else if (lower.includes('q4') || lower.includes('epic') || lower.includes('purple')) quality = 'purple';
  else if (lower.includes('q5') || lower.includes('legendary') || lower.includes('gold')) quality = 'gold';
  else if (lower.includes('q6') || lower.includes('mythic') || lower.includes('red')) quality = 'red';

  return {
    id: idOrCodeOrSlot,
    imageFileName,
    imagePath: `/assets/items/${imageFileName}`,
    cdnUrl: `https://intel.warera.wiki/assets/${imageFileName}`,
    slot: resolvedSlot,
    quality,
    label: idOrCodeOrSlot
  };
}

/**
 * Returns the resolved item image URL (local asset path) for an equipment item or ID.
 */
export function getEquipmentImageUrl(idOrCodeOrSlot: string, slot?: EquipmentSlot): string {
  return getEquipmentAsset(idOrCodeOrSlot, slot).imagePath;
}

/**
 * Returns the quality border tier ('grey' | 'green' | 'blue' | 'purple' | 'gold' | 'red' | 'none')
 * for an equipment item or ID.
 */
export function getEquipmentQuality(idOrCodeOrSlot: string): ItemQualityTier {
  return getEquipmentAsset(idOrCodeOrSlot).quality;
}
