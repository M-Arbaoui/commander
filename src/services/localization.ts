import { Language, BuildObjective, RecommendationVerdict } from '../types';

export interface TranslationDict {
  brandName: string;
  tagline: string;
  builtBy: string;
  navHome: string;
  navWar: string;
  navBuild: string;
  navCombat: string;
  navEconomy: string;
  navPlayers: string;
  navMilitaryUnit: string;
  navCountry: string;
  navSettings: string;
  navApiDiscovery: string;
  comingSoon: string;

  // Account
  playerHandle: string;
  enterHandle: string;
  loadAccount: string;
  handleExplanation: string;
  changeHandle: string;
  clearHandle: string;
  level: string;
  country: string;
  militaryUnit: string;
  coins: string;
  energy: string;
  health: string;
  publicDataNotice: string;
  accountSummary: string;

  // Home Screen
  decisionCenterTitle: string;
  decisionCenterSubtitle: string;
  primaryDecision: string;
  followUpDecisions: string;
  avoidForNow: string;
  currentWarSummary: string;
  noActiveWarSelected: string;
  selectWarPrompt: string;
  estimatedDamage: string;
  estimatedCost: string;
  currentBonus: string;
  whyThisRecommendation: string;
  viewDetails: string;
  hideDetails: string;

  // Decision Card Labels
  expectedResult: string;
  cost: string;
  reason: string;
  verdict: string;
  confidence: string;
  action: string;
  opportunityCost: string;

  // War Screen
  warTitle: string;
  warSubtitle: string;
  warSelectionNote: string;
  filterAll: string;
  filterActive: string;
  filterDefense: string;
  filterAttack: string;
  searchWars: string;
  bonusBreakdownTitle: string;
  personalBonus: string;
  muBonus: string;
  countryBonus: string;
  specialPillBonus: string;
  totalApplicableBonus: string;
  transparentCalculation: string;
  calculationFormulaNote: string;
  rounds: string;
  timeRemaining: string;

  // Build Screen
  buildTitle: string;
  buildSubtitle: string;
  objectiveSelector: string;
  objectives: Record<BuildObjective, { label: string; description: string }>;
  currentBuild: string;
  recommendedBuild: string;
  comparison: string;
  currentVsRecommended: string;
  damageGain: string;
  costToUpgrade: string;
  efficiencyGain: string;
  slotWeapon: string;
  slotHelmet: string;
  slotChest: string;
  slotPants: string;
  slotBoots: string;
  slotGloves: string;
  skillsSection: string;
  combatSkills: string;
  economicSkills: string;
  resetWarning: string;

  // Economy Screen
  economyTitle: string;
  economySubtitle: string;
  purchaseEvaluationTitle: string;
  marketOpportunities: string;
  efficiencyMetric: string;
  expectedGain: string;
  paybackPeriod: string;
  verdicts: Record<RecommendationVerdict, string>;

  // API Discovery
  apiTitle: string;
  apiSubtitle: string;
  gatewayStatus: string;
  cachedEndpoints: string;
  directTrpc: string;
  dataIntegrityRule: string;

  // Settings
  settingsTitle: string;
  languageSelect: string;
  activeDataSource: string;
  clearLocalData: string;
  resetConfirm: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    brandName: 'QASWARA',
    tagline: 'War Era Strategy & Decision Companion',
    builtBy: 'Built by MOUHAB',
    navHome: 'Home',
    navWar: 'War',
    navBuild: 'Build Tool',
    navCombat: 'Combat Simulator',
    navEconomy: 'Economy',
    navPlayers: 'Players',
    navMilitaryUnit: 'Military Unit',
    navCountry: 'Country',
    navSettings: 'Settings',
    navApiDiscovery: 'API & Gateway Reference',
    comingSoon: 'Coming Next',

    playerHandle: 'Player Handle',
    enterHandle: 'Enter War Era Username',
    loadAccount: 'Load Account',
    handleExplanation: 'Your handle is used to load your public War Era profile, equipment, skills, and battle data. No password or login required.',
    changeHandle: 'Change Handle',
    clearHandle: 'Clear',
    level: 'Level',
    country: 'Country',
    militaryUnit: 'Military Unit',
    coins: 'Coins',
    energy: 'Energy',
    health: 'Health',
    publicDataNotice: 'Verified public War Era data',
    accountSummary: 'Account Overview',

    decisionCenterTitle: 'Decision Center',
    decisionCenterSubtitle: 'What matters most right now for your account',
    primaryDecision: 'Primary Recommendation',
    followUpDecisions: 'Secondary Opportunities',
    avoidForNow: 'Avoid For Now',
    currentWarSummary: 'Current War Status',
    noActiveWarSelected: 'No active war selected yet',
    selectWarPrompt: 'Select a war to calculate applicable bonuses and combat costs',
    estimatedDamage: 'Estimated Damage',
    estimatedCost: 'Estimated Cost',
    currentBonus: 'Total Bonus Multiplier',
    whyThisRecommendation: 'Why this recommendation?',
    viewDetails: 'Show calculation breakdown',
    hideDetails: 'Hide calculation breakdown',

    expectedResult: 'Expected Outcome',
    cost: 'Cost',
    reason: 'Reasoning',
    verdict: 'Verdict',
    confidence: 'Confidence',
    action: 'Apply / Action',
    opportunityCost: 'Opportunity Cost',

    warTitle: 'War Analysis',
    warSubtitle: 'Transparent bonus compounding and battle cost calculations',
    warSelectionNote: 'QASWARA never chooses wars for you. Select a war to inspect verifiable bonuses.',
    filterAll: 'All Battles',
    filterActive: 'Active Wars',
    filterDefense: 'Defense',
    filterAttack: 'Attack',
    searchWars: 'Search by country or region...',
    bonusBreakdownTitle: 'Active Bonus Breakdown',
    personalBonus: 'Personal Account Bonus',
    muBonus: 'Military Unit Bonus',
    countryBonus: 'Country / Alliances Bonus',
    specialPillBonus: 'Consumable (Damage Pill) Bonus',
    totalApplicableBonus: 'Total Compounded Multiplier',
    transparentCalculation: 'Transparent Calculation Pipeline',
    calculationFormulaNote: 'War Era bonuses stack multiplicatively across distinct categories, verified against combat logs.',
    rounds: 'Rounds',
    timeRemaining: 'Remaining',

    buildTitle: 'Equipment & Build Optimization',
    buildSubtitle: 'Account-tailored loadout recommendations based on your current objective',
    objectiveSelector: 'Strategic Objective',
    objectives: {
      max_damage: {
        label: 'Maximum Damage',
        description: 'Maximize total combat damage output regardless of coin expenditure.'
      },
      coin_efficiency: {
        label: 'Coin Efficiency',
        description: 'Prioritize highest damage increase per single coin spent.'
      },
      balanced: {
        label: 'Balanced Strategy',
        description: 'Equally balance raw damage performance with conservative resource use.'
      },
      budget: {
        label: 'Strict Budget',
        description: 'Enforce a strict coin ceiling while extracting maximum utility.'
      },
      high_bonus: {
        label: 'High Bonus Compounding',
        description: 'Synergize gear with current active war and alliance multipliers.'
      },
      war_preparation: {
        label: 'War Preparation',
        description: 'Prepare loadout durability and ammunition reserves for sustained combat.'
      }
    },
    currentBuild: 'Current Equipment',
    recommendedBuild: 'Optimized Recommendation',
    comparison: 'Side-by-Side Comparison',
    currentVsRecommended: 'Current vs Recommended',
    damageGain: 'Damage Gain',
    costToUpgrade: 'Required Coins',
    efficiencyGain: 'Efficiency (Gain / Cost)',
    slotWeapon: 'Weapon',
    slotHelmet: 'Helmet',
    slotChest: 'Armor / Chest',
    slotPants: 'Pants',
    slotBoots: 'Boots',
    slotGloves: 'Gloves',
    skillsSection: 'Skills Allocation & Analysis',
    combatSkills: 'Combat Skills',
    economicSkills: 'Economic Skills',
    resetWarning: 'Notice: Skill point resets incur heavy coin penalties. Never reset unless calculated gains exceed reset fee.',

    economyTitle: 'Economic Strategy & Market Evaluation',
    economySubtitle: 'Spend coins with mathematical discipline. Avoid traps and evaluate opportunity cost.',
    purchaseEvaluationTitle: 'Purchase Evaluation Matrix',
    marketOpportunities: 'Ranked Market Opportunities',
    efficiencyMetric: 'Efficiency Score',
    expectedGain: 'Expected Gain',
    paybackPeriod: 'Estimated Payback',
    verdicts: {
      Recommended: 'Recommended',
      Buy: 'Buy',
      Wait: 'Wait',
      'Upgrade Something Else': 'Upgrade Alternative',
      Avoid: 'Avoid For Now'
    },

    apiTitle: 'War Era API & Gateway Reference',
    apiSubtitle: 'Official endpoints, Hattorius Gateway documentation, response schemas, and verified mechanics map',
    gatewayStatus: 'Gateway: Active (400ms Batching, Smart Cache)',
    cachedEndpoints: '38 Endpoints Supported',
    directTrpc: 'Endpoint: api2.warera.io/trpc (GET Queries)',
    dataIntegrityRule: 'Rule: Never invent game mechanics. Gaps are explicitly marked.',

    settingsTitle: 'Settings & Data Preferences',
    languageSelect: 'Interface Language',
    activeDataSource: 'War Era Data Source',
    clearLocalData: 'Clear Local Browser Storage',
    resetConfirm: 'Reset all stored profile settings and reload?'
  },
  ar: {
    brandName: 'قَسْوَرَة',
    tagline: 'منصة القرارات الاستراتيجية لحرب العصور (War Era)',
    builtBy: 'مبني بواسطة مهاب',
    navHome: 'الرئيسية',
    navWar: 'الحرب',
    navBuild: 'أداة العتاد والتحسين',
    navCombat: 'محاكي القتال',
    navEconomy: 'الاقتصاد',
    navPlayers: 'اللاعبون',
    navMilitaryUnit: 'الوحدة العسكرية',
    navCountry: 'الدولة',
    navSettings: 'الإعدادات',
    navApiDiscovery: 'دليل الواجهة البرمجية (API)',
    comingSoon: 'قريباً',

    playerHandle: 'اسم المستخدم',
    enterHandle: 'أدخل اسم اللاعب في War Era',
    loadAccount: 'تحميل الحساب',
    handleExplanation: 'يُستخدم اسم حسابك لتحميل ملفك الشخصي العام وعتادك ومهاراتك وإحصاءاتك. لا يتطلب أي كلمة مرور.',
    changeHandle: 'تعديل الحساب',
    clearHandle: 'مسح',
    level: 'المستوى',
    country: 'الدولة',
    militaryUnit: 'الوحدة العسكرية',
    coins: 'العملات',
    energy: 'الطاقة',
    health: 'الصحة',
    publicDataNotice: 'بيانات عامة موثقة من لعبة War Era',
    accountSummary: 'ملخص الحساب',

    decisionCenterTitle: 'مركز القرارات',
    decisionCenterSubtitle: 'ما هي الخطوة الأهم لحسابك في هذه اللحظة؟',
    primaryDecision: 'التوصية الأساسية',
    followUpDecisions: 'فرص ثانوية بديلة',
    avoidForNow: 'تجنب حالياً',
    currentWarSummary: 'موقف الحرب الحالية',
    noActiveWarSelected: 'لم يتم تحديد حرب نشطة بعد',
    selectWarPrompt: 'اختر حرباً من قسم الحروب لاحتساب المكافآت المركبة وتكاليف القتال بدقة',
    estimatedDamage: 'الضرر التقديري',
    estimatedCost: 'التكلفة التقديرية',
    currentBonus: 'مضاعف المكافآت الإجمالي',
    whyThisRecommendation: 'لماذا هذه التوصية تحديداً؟',
    viewDetails: 'عرض تفاصيل الحساب والمعادلة',
    hideDetails: 'إخفاء تفاصيل الحساب',

    expectedResult: 'النتيجة المتوقعة',
    cost: 'التكلفة',
    reason: 'المسوغ الاستراتيجي',
    verdict: 'القرار',
    confidence: 'مستوى الثقة',
    action: 'تنفيذ / إجراء',
    opportunityCost: 'تكلفة الفرصة البديلة',

    warTitle: 'تحليل المعارك والحروب',
    warSubtitle: 'احتساب شفاف لتراكم المكافآت وتقدير تكاليف خوض المعارك',
    warSelectionNote: 'قسورة لا تختار الحروب نيابة عن اللاعب. يحدد اللاعب معركته وتقوم المنصة بتحليلها.',
    filterAll: 'جميع المعارك',
    filterActive: 'الحروب الجارية',
    filterDefense: 'دفاع',
    filterAttack: 'هجوم',
    searchWars: 'بحث بالدولة أو الإقليم...',
    bonusBreakdownTitle: 'تفصيل المكافآت النشطة',
    personalBonus: 'مكافأة الحساب الشخصية',
    muBonus: 'مكافأة الوحدة العسكرية',
    countryBonus: 'مكافأة الدولة والتحالفات',
    specialPillBonus: 'مكافأة الحبوب القتالية (Pill)',
    totalApplicableBonus: 'المضاعف الإجمالي المطبق',
    transparentCalculation: 'مسار الاحتساب الشفاف',
    calculationFormulaNote: 'تتراكم مكافآت War Era بصورة ضربية عبر الفئات المختلفة، موثقة من سجلات القتال المعتمدة.',
    rounds: 'الجولات',
    timeRemaining: 'المتبقي',

    buildTitle: 'تحسين العتاد والتسليح',
    buildSubtitle: 'توصيات تسليح مخصصة لحسابك وفق الهدف الاستراتيجي المختار',
    objectiveSelector: 'الهدف الاستراتيجي',
    objectives: {
      max_damage: {
        label: 'أقصى ضرر ممكن',
        description: 'رفع إجمالي الضرر القتالي إلى أعلى حد ممكن بغض النظر عن استهلاك العملات.'
      },
      coin_efficiency: {
        label: 'أعلى كفاءة للعملة',
        description: 'الأولوية لأعلى زيادة في الضرر مقابل كل عملة واحدة تُنفق.'
      },
      balanced: {
        label: 'استراتيجية متوازنة',
        description: 'الموازنة الدقيقة بين قوة الضرر والاستهلاك الرشيد للموارد.'
      },
      budget: {
        label: 'ميزانية محددة',
        description: 'الالتزام بسقف إنفاق صارم مع تحقيق أقصى عائد قتالي متاح.'
      },
      high_bonus: {
        label: 'استثمار مضاعفات الحرب',
        description: 'مواءمة العتاد مع المكافآت التراكمية النشطة في حربك الحالية.'
      },
      war_preparation: {
        label: 'الاستعداد للحرب',
        description: 'تحسين متانة العتاد وتجهيز الذخيرة للمعارك الممتدة.'
      }
    },
    currentBuild: 'العتاد الحالي',
    recommendedBuild: 'التجهيز الموصى به',
    comparison: 'المقارنة المباشرة',
    currentVsRecommended: 'الحالي مقابل الموصى به',
    damageGain: 'فارق الضرر',
    costToUpgrade: 'العملات المطلوبة',
    efficiencyGain: 'الكفاءة (المكسب / التكلفة)',
    slotWeapon: 'السلاح',
    slotHelmet: 'الخوذة',
    slotChest: 'الدرع / الصدرية',
    slotPants: 'السروال',
    slotBoots: 'الحذاء',
    slotGloves: 'القفازات',
    skillsSection: 'توزيع وتحليل المهارات',
    combatSkills: 'المهارات القتالية',
    economicSkills: 'المهارات الاقتصادية',
    resetWarning: 'تنبيه: إعادة تعيين المهارات تكلف عملات باهظة. لا تقم بإعادة التعيين إلا إذا كان المكسب المحسوب يفوق الرسوم.',

    economyTitle: 'الاستراتيجية الاقتصادية وتقييم السوق',
    economySubtitle: 'إدارة العملات بانضباط حسابي، وتفادي الفخاخ، وحساب تكلفة الفرصة البديلة.',
    purchaseEvaluationTitle: 'مصفوفة تقييم المشتريات',
    marketOpportunities: 'الفرص المتاحة في السوق حسب الأولوية',
    efficiencyMetric: 'مؤشر الكفاءة',
    expectedGain: 'المكسب المتوقع',
    paybackPeriod: 'فترة استرداد التكلفة',
    verdicts: {
      Recommended: 'موصى به',
      Buy: 'شراء',
      Wait: 'انتظار',
      'Upgrade Something Else': 'ترقية بديل آخر',
      Avoid: 'تجنب حالياً'
    },

    apiTitle: 'توثيق واجهة War Era البرمجية والبوابة',
    apiSubtitle: 'المسارات الرسمية، بوابة Hattorius، مخططات الاستجابة، وخريطة القواعد المعتمدة',
    gatewayStatus: 'البوابة: نشطة (تجميع 400ms، وذاكرة مؤقتة ذكية)',
    cachedEndpoints: '38 مساراً مدعوماً',
    directTrpc: 'المسار المباشر: api2.warera.io/trpc (استعلامات GET)',
    dataIntegrityRule: 'قاعدة: عدم اختلاق أي قواعد فيزيائية أو برمجية. الفجوات محددة بوضوح.',

    settingsTitle: 'الإعدادات وتفضيلات البيانات',
    languageSelect: 'لغة الواجهة',
    activeDataSource: 'مصدر بيانات War Era',
    clearLocalData: 'مسح البيانات المخزنة محلياً في المتصفح',
    resetConfirm: 'هل تريد إعادة ضبط جميع الإعدادات وإعادة التحميل؟'
  }
};
