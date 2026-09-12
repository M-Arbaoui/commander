import { ApiEndpointDoc } from '../types';

export const WAR_ERA_API_ENDPOINTS: ApiEndpointDoc[] = [
  // User endpoints
  {
    id: 'user-get-user-lite',
    category: 'User',
    method: 'GET',
    path: '/user.getUserLite',
    procedure: 'user.getUserLite',
    gatewayCached: true,
    cacheTtlSeconds: 60,
    description: 'Retrieves a simplified user profile, level, coins, active military unit, and country nationality.',
    authRequired: false,
    rateLimit: 'Standard (Gateway batches queries in 400ms window)',
    parameters: [
      { name: 'username', type: 'string', required: true, description: 'War Era player handle or username' }
    ],
    responseFields: [
      { field: 'id', type: 'string', verified: 'Verified', notes: 'Unique player UUID' },
      { field: 'username', type: 'string', verified: 'Verified', notes: 'In-game handle' },
      { field: 'level', type: 'number', verified: 'Verified', notes: 'Current account progression level' },
      { field: 'countryId', type: 'string', verified: 'Verified', notes: 'Citizenship country ID' },
      { field: 'countryName', type: 'string', verified: 'Verified', notes: 'Name of the sovereign country' },
      { field: 'militaryUnitId', type: 'string | null', verified: 'Verified', notes: 'Active military unit ID if enrolled' },
      { field: 'militaryUnitName', type: 'string | null', verified: 'Verified', notes: 'Name of the MU (e.g. MAR ROYAL ARMY)' },
      { field: 'energy', type: 'number', verified: 'Verified', notes: 'Current energy pool (max 100 or boosted)' },
      { field: 'coins', type: 'number', verified: 'Verified', notes: 'Current liquid coin balance' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            id: "usr_994812",
            username: "MOUHAB",
            level: 42,
            countryId: "cnt_mar",
            countryName: "Morocco",
            militaryUnitId: "mu_mra_01",
            militaryUnitName: "MAR ROYAL ARMY",
            energy: 94,
            maxEnergy: 100,
            health: 100,
            coins: 14850
          }
        }
      }
    }, null, 2)
  },
  {
    id: 'user-get-by-country',
    category: 'User',
    method: 'GET',
    path: '/user.getUsersByCountry',
    procedure: 'user.getUsersByCountry',
    gatewayCached: true,
    cacheTtlSeconds: 300,
    description: 'Fetches list of active registered citizens for a designated country ID.',
    authRequired: false,
    rateLimit: 'Cached for 5 minutes in Gateway',
    parameters: [
      { name: 'countryId', type: 'string', required: true, description: 'Country identifier' },
      { name: 'limit', type: 'number', required: false, description: 'Page limit (default 20, max 100)' }
    ],
    responseFields: [
      { field: 'users', type: 'Array<UserSummary>', verified: 'Verified', notes: 'Paginated user summaries' },
      { field: 'totalCount', type: 'number', verified: 'Verified', notes: 'Total country citizen count' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            users: [
              { id: "usr_994812", username: "MOUHAB", level: 42, muRank: "Commander" },
              { id: "usr_883109", username: "TarikAtlas", level: 38, muRank: "Officer" }
            ],
            totalCount: 342
          }
        }
      }
    }, null, 2)
  },

  // Battles & Wars
  {
    id: 'battle-get-battles',
    category: 'Battles',
    method: 'GET',
    path: '/battle.getBattles',
    procedure: 'battle.getBattles',
    gatewayCached: true,
    cacheTtlSeconds: 15,
    description: 'Lists all active, recent, and queued wars and regional battles worldwide.',
    authRequired: false,
    rateLimit: 'High frequency polling proxied by Gateway cache (15s TTL)',
    parameters: [
      { name: 'status', type: "'active' | 'ended'", required: false, description: 'Filter war state' },
      { name: 'type', type: "'direct' | 'resistance'", required: false, description: 'Battle classification' }
    ],
    responseFields: [
      { field: 'id', type: 'string', verified: 'Verified', notes: 'Battle identifier' },
      { field: 'attackerCountryId', type: 'string', verified: 'Verified', notes: 'Attacking state ID' },
      { field: 'defenderCountryId', type: 'string', verified: 'Verified', notes: 'Defending state ID' },
      { field: 'regionName', type: 'string', verified: 'Verified', notes: 'Contested province / region' },
      { field: 'currentRound', type: 'number', verified: 'Verified', notes: 'Active round number' },
      { field: 'attackerPoints', type: 'number', verified: 'Verified', notes: 'Current round domination points' },
      { field: 'defenderPoints', type: 'number', verified: 'Verified', notes: 'Defender domination points' },
      { field: 'endsAt', type: 'string (ISO)', verified: 'Verified', notes: 'Round expiry timestamp' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: [
            {
              id: "bat_7811",
              attackerCountryName: "Morocco",
              defenderCountryName: "Spain",
              regionName: "Gibraltar Strait",
              currentRound: 4,
              attackerPoints: 1250,
              defenderPoints: 980,
              status: "active",
              type: "direct"
            }
          ]
        }
      }
    }, null, 2)
  },
  {
    id: 'battle-get-by-id',
    category: 'Battles',
    method: 'GET',
    path: '/battle.getById',
    procedure: 'battle.getById',
    gatewayCached: true,
    cacheTtlSeconds: 15,
    description: 'Detailed inspection of a specific battle, participating military units, and regional defense bonuses.',
    authRequired: false,
    rateLimit: '15s cache TTL',
    parameters: [
      { name: 'battleId', type: 'string', required: true, description: 'Battle identifier' }
    ],
    responseFields: [
      { field: 'battle', type: 'BattleDetail', verified: 'Verified', notes: 'Full metadata and wall score' },
      { field: 'rounds', type: 'Array<RoundDetail>', verified: 'Verified', notes: 'Historical round results' },
      { field: 'activeBuffs', type: 'Array<Buff>', verified: 'Partially documented', notes: 'Active defensive bunkers / orders' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            id: "bat_7811",
            attackerCountry: { id: "cnt_mar", name: "Morocco", flag: "mar" },
            defenderCountry: { id: "cnt_esp", name: "Spain", flag: "esp" },
            region: "Gibraltar Strait",
            bunkerDefenseBonus: 0.15,
            totalHits: 4120
          }
        }
      }
    }, null, 2)
  },
  {
    id: 'battle-get-live-battle-data',
    category: 'Battles',
    method: 'GET',
    path: '/battle.getLiveBattleData',
    procedure: 'battle.getLiveBattleData',
    gatewayCached: true,
    cacheTtlSeconds: 5,
    description: 'Real-time live damage stream, round bar percentage, and top round hero contenders.',
    authRequired: false,
    rateLimit: 'Fast-poll (Hattorius Gateway dedupes duplicate hits)',
    parameters: [
      { name: 'battleId', type: 'string', required: true, description: 'Battle ID' }
    ],
    responseFields: [
      { field: 'attackerDamage', type: 'number', verified: 'Verified', notes: 'Accumulated round damage' },
      { field: 'defenderDamage', type: 'number', verified: 'Verified', notes: 'Accumulated round damage' },
      { field: 'lastHits', type: 'Array<HitLog>', verified: 'Verified', notes: 'Recent player strikes' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            attackerDamage: 4892000,
            defenderDamage: 4310500,
            ratio: 1.135
          }
        }
      }
    }, null, 2)
  },
  {
    id: 'battle-ranking-get-ranking',
    category: 'Battles',
    method: 'GET',
    path: '/battleRanking.getRanking',
    procedure: 'battleRanking.getRanking',
    gatewayCached: true,
    cacheTtlSeconds: 60,
    description: 'Leaderboard of top damage contributors in battles for Battle Hero and Campaign medals.',
    authRequired: false,
    rateLimit: '60s cache TTL',
    parameters: [
      { name: 'battleId', type: 'string', required: true, description: 'Battle ID' },
      { name: 'side', type: "'attacker' | 'defender'", required: true, description: 'Battle flank' }
    ],
    responseFields: [
      { field: 'rankings', type: 'Array<HeroRank>', verified: 'Verified', notes: 'Rank, username, and total damage' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            rankings: [
              { rank: 1, username: "MOUHAB", totalDamage: 1820400, hits: 140 },
              { rank: 2, username: "VanguardX", totalDamage: 1410200, hits: 112 }
            ]
          }
        }
      }
    }, null, 2)
  },

  // Market & Economy
  {
    id: 'item-trading-get-prices',
    category: 'Market',
    method: 'GET',
    path: '/itemTrading.getPrices',
    procedure: 'itemTrading.getPrices',
    gatewayCached: true,
    cacheTtlSeconds: 120,
    description: 'Current real-time lowest ask and highest bid across global player marketplace.',
    authRequired: false,
    rateLimit: 'Gateway cached 120s',
    parameters: [
      { name: 'itemType', type: 'string', required: false, description: 'Filter item (e.g. Iron, Steel, Ammo, Bread)' }
    ],
    responseFields: [
      { field: 'itemId', type: 'string', verified: 'Verified', notes: 'Item identifier' },
      { field: 'lowestAsk', type: 'number', verified: 'Verified', notes: 'Cheapest buy-now unit price' },
      { field: 'highestBid', type: 'number', verified: 'Verified', notes: 'Top purchase demand order' },
      { field: 'volume24h', type: 'number', verified: 'Partially documented', notes: '24h traded quantities' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: [
            { itemId: "ammo_q5", lowestAsk: 24.5, highestBid: 23.8, volume24h: 18500 },
            { itemId: "steel_q4", lowestAsk: 12.2, highestBid: 11.9, volume24h: 32000 },
            { itemId: "combat_pill_60", lowestAsk: 850.0, highestBid: 820.0, volume24h: 410 }
          ]
        }
      }
    }, null, 2)
  },
  {
    id: 'trading-order-get-top-orders',
    category: 'Market',
    method: 'GET',
    path: '/tradingOrder.getTopOrders',
    procedure: 'tradingOrder.getTopOrders',
    gatewayCached: true,
    cacheTtlSeconds: 60,
    description: 'Top order book depth for calculating price impact and bulk upgrade procurement.',
    authRequired: false,
    rateLimit: '60s cache TTL',
    parameters: [
      { name: 'itemId', type: 'string', required: true, description: 'Item identifier' },
      { name: 'type', type: "'buy' | 'sell'", required: true, description: 'Order book side' }
    ],
    responseFields: [
      { field: 'orders', type: 'Array<BookOrder>', verified: 'Verified', notes: 'Price, available amount, seller' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            orders: [
              { price: 24.5, quantity: 450, total: 11025 },
              { price: 25.0, quantity: 1200, total: 30000 }
            ]
          }
        }
      }
    }, null, 2)
  },

  // Military Unit & Country
  {
    id: 'mu-get-details',
    category: 'Military Unit',
    method: 'GET',
    path: '/militaryUnit.getMilitaryUnit',
    procedure: 'militaryUnit.getMilitaryUnit',
    gatewayCached: true,
    cacheTtlSeconds: 300,
    description: 'Inspects military unit stats, commander orders, damage bonus level, and armory balance.',
    authRequired: false,
    rateLimit: 'Cached 300s',
    parameters: [
      { name: 'militaryUnitId', type: 'string', required: true, description: 'Military Unit ID' }
    ],
    responseFields: [
      { field: 'id', type: 'string', verified: 'Verified', notes: 'MU UUID' },
      { field: 'name', type: 'string', verified: 'Verified', notes: 'Name (e.g. MAR ROYAL ARMY)' },
      { field: 'level', type: 'number', verified: 'Verified', notes: 'Unit upgrade level' },
      { field: 'damageBonusPercent', type: 'number', verified: 'Verified', notes: 'Bonus multiplier for members (+5% to +20%)' },
      { field: 'orderBattleId', type: 'string | null', verified: 'Verified', notes: 'Active priority battle set by Commander' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            id: "mu_mra_01",
            name: "MAR ROYAL ARMY",
            level: 7,
            damageBonusPercent: 14.0,
            activeMembersCount: 48,
            orderBattleId: "bat_7811"
          }
        }
      }
    }, null, 2)
  },
  {
    id: 'country-get-country',
    category: 'Country',
    method: 'GET',
    path: '/country.getCountry',
    procedure: 'country.getCountry',
    gatewayCached: true,
    cacheTtlSeconds: 600,
    description: 'Country metadata, active mutual protection pacts (MPP), and national defense modifiers.',
    authRequired: false,
    rateLimit: 'Cached 600s',
    parameters: [
      { name: 'countryId', type: 'string', required: true, description: 'Country ID' }
    ],
    responseFields: [
      { field: 'id', type: 'string', verified: 'Verified', notes: 'Country code / ID' },
      { field: 'name', type: 'string', verified: 'Verified', notes: 'Sovereign nation name' },
      { field: 'mppAgreements', type: 'Array<string>', verified: 'Verified', notes: 'Mutual protection allies' },
      { field: 'capitalRegion', type: 'string', verified: 'Verified', notes: 'Capital province' }
    ],
    exampleResponse: JSON.stringify({
      result: {
        data: {
          json: {
            id: "cnt_mar",
            name: "Morocco",
            alliances: ["MPP_Alliance_North", "Pact_Alpha"],
            bonusModifier: 1.10
          }
        }
      }
    }, null, 2)
  }
];

export const DATA_GAPS_AND_UNKNOWNS = [
  {
    topic: 'Critical Hit Exact Seed Formula',
    status: 'Partially documented',
    finding: 'Critical strike chance scales with the Precision and Crit Chance skills and weapon tier, but exact RNG roll distribution is computed server-side in node workers.',
    qaswaraGuideline: 'Use expected mean damage (deterministic mathematically) rather than assuming pseudo-random distribution spikes.'
  },
  {
    topic: 'Simultaneous Pill Stacking Limits',
    status: 'Verified',
    finding: 'Damage pills provide +60% combat damage for an 8-hour fixed duration. Multiple pills do NOT stack percentage; they extend duration.',
    qaswaraGuideline: 'Cap pill bonus calculation strictly at single-pill +60% multiplier.'
  },
  {
    topic: 'Durability Loss on Equipment Dodge',
    status: 'Verified',
    finding: 'When a Dodge roll succeeds, incoming hit damage is nullified (100% mitigation) and equipment loses zero durability points.',
    qaswaraGuideline: 'Factored into Coin Efficiency calculations for long battle runs.'
  },
  {
    topic: 'Skill Point Reset Cost Progression',
    status: 'Unknown exact scaling',
    finding: 'First reset is known to cost 500 coins, but scaling multiplier for subsequent resets lacks official schema documentation.',
    qaswaraGuideline: 'Mark reset cost as "Estimated baseline 500+ coins" and flag recommendation as High Caution.'
  }
];

export const WAR_ERA_ECO_SIMULATOR_SPEC = {
  name: 'War Era Eco Simulator Reference',
  repo: 'github.com/WarEraProjects',
  formula: 'Net Energy Profit = (MarketPrice * OutputQuantity) - (WorkerWages + RawMaterialCost + FactoryDepreciation)',
  rules: [
    'Energy is the fundamental currency of production.',
    'Work offers determine labor expense per hour.',
    'Market ask/bid spread dictates whether holding inventory is profitable vs immediate liquidation.'
  ]
};
