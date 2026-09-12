import { PlayerDTO, BuildMode, GeminiNextBestAction } from '../types';

export interface NextBestActionResult {
  source: 'gemini' | 'fallback';
  action: GeminiNextBestAction;
}

export async function fetchGeminiNextBestAction(
  player: PlayerDTO,
  playstyle: BuildMode = 'soldier'
): Promise<NextBestActionResult> {
  try {
    const res = await fetch('/api/gemini/next-best-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player, playstyle })
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      source: data.source || 'fallback',
      action: data.action
    };
  } catch (err) {
    console.warn('Falling back to local heuristic advisor:', err);
    // Instant client-side fallback in case server or network has hiccups
    const unspent = player.unspentSkillPoints ?? 4;
    const coins = player.coins || 0;

    let fallbackAction: GeminiNextBestAction;
    if (unspent > 0) {
      fallbackAction = {
        title: 'Allocate Points into Precision',
        category: 'skill',
        why: `With ${unspent} unspent points at Level ${player.level}, increasing Precision prevents enemy defenders from dodging or glancing your attacks.`,
        expectedImpact: '+14% Hit Reliability & Consistent Critical Procs',
        actionSteps: 'Click Allocate in the Skill Suggestions below.',
        tip: 'Prioritizing accuracy is twice as cost-efficient as pure attack at your current level.'
      };
    } else if (coins >= 2500) {
      fallbackAction = {
        title: 'Upgrade Primary Weapon',
        category: 'gear',
        why: `You have ${coins.toLocaleString()} coins available. Upgrading your weapon gives the highest raw base damage return per gold spent.`,
        expectedImpact: '+16 Attack Multiplier across all combat energy',
        actionSteps: 'Select Buy & Equip in the Gear Upgrades panel.',
        tip: 'Weapon damage is multiplied by both critical strikes and military unit buffs.'
      };
    } else {
      fallbackAction = {
        title: 'Clock In Daily Factory Shift',
        category: 'economy',
        why: `Your treasury is at ${coins.toLocaleString()} coins. Securing your daily wage funds the ammunition and equipment upgrades needed for wars.`,
        expectedImpact: '+450 Coins & +10 XP towards Level ' + (player.level + 1),
        actionSteps: 'Check off Step 1 in your Daily Routine.',
        tip: 'Consistent daily work builds streak multipliers in your nation.'
      };
    }

    return {
      source: 'fallback',
      action: fallbackAction
    };
  }
}
