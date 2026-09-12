import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialized Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Gemini AI: Personalized Next-Best-Action
  app.post('/api/gemini/next-best-action', async (req, res) => {
    try {
      const { player, playstyle = 'soldier' } = req.body;
      if (!player) {
        return res.status(400).json({ error: 'Player data is required' });
      }

      const ai = getAIClient();
      if (!ai) {
        // High-quality deterministic fallback when GEMINI_API_KEY is not configured
        const unspent = player.unspentSkillPoints ?? 0;
        const coins = Number(player.coins) || 0;
        const level = Number(player.level) || 1;

        let fallbackAction;
        if (unspent > 0) {
          fallbackAction = {
            title: 'Allocate +1 Point into Precision',
            category: 'skill',
            why: `At Level ${level}, defender dodge rates reduce your damage. Raising Precision ensures 100% of your hits connect for maximum damage.`,
            expectedImpact: '+14% Average Hit Reliability & Eliminates Glancing Damage',
            actionSteps: 'Click Allocate +1 next to Precision in the suggestions list.',
            tip: 'Always balance Precision with Attack to prevent wasted combat energy.'
          };
        } else if (coins >= 3000) {
          fallbackAction = {
            title: 'Upgrade Primary Weapon to Tier 3',
            category: 'gear',
            why: `You have ${coins.toLocaleString()} coins in treasury. Purchasing the next weapon tier provides an immediate base attack boost.`,
            expectedImpact: '+18 Base Attack on Every Attack Swing',
            actionSteps: 'Click Buy & Equip in the Gear Upgrades panel below.',
            tip: 'Weapon upgrades scale with all your attack and critical multipliers.'
          };
        } else {
          fallbackAction = {
            title: 'Complete Daily Work Shift & Claim Wages',
            category: 'economy',
            why: `Your treasury is at ${coins.toLocaleString()} coins. Working a daily shift provides guaranteed cash to fund weapon upgrades and ammo.`,
            expectedImpact: '+420 Coins & +10 XP towards your next level',
            actionSteps: 'Check off Step 1 in your Daily Routine checklist.',
            tip: 'Maintaining work streaks gives compounding wage bonuses.'
          };
        }

        return res.json({
          source: 'fallback',
          action: fallbackAction
        });
      }

      const gearSummary = Object.entries(player.equipment || {})
        .map(([slot, item]: [string, any]) => `${slot}: ${item?.name || 'None'} (Tier ${item?.level || 1}, Atk +${item?.attackBonus || 0}, Arm +${item?.armorBonus || 0})`)
        .join(', ');

      const prompt = `You are a strategic military advisor in the browser MMO game "War Era".
Analyze the player's profile:
- Player Level: ${player.level}
- Gold Coins (Treasury): ${player.coins}
- Unspent Skill Points: ${player.unspentSkillPoints ?? 0}
- Current Focus / Playstyle: ${playstyle}
- Key Skills: Attack: ${player.skills?.attack || 0}, Precision: ${player.skills?.precision || 0}, Crit Chance: ${player.skills?.criticalChance || 0}%, Armor: ${player.skills?.armor || 0}, Energy Pool: ${player.maxEnergy || 100}, Entrepreneurship: ${player.skills?.entrepreneurship || 0}, Companies Limit: ${player.skills?.companiesLimit || 0}
- Current Gear: ${gearSummary}

TASK:
Identify and suggest EXACTLY ONE single, high-impact "Next-Best-Action" (strategic move or upgrade) that the player should take right now.
REQUIREMENTS:
1. Filter out all complex math, simulation formulas, or confusing tables.
2. Keep it approachable, clear, motivating, and directly actionable.
3. Suggest the single best move based on their level, coins, and equipment tier (e.g. allocating an unspent point, buying an affordable weapon upgrade, or daily energy efficiency).
4. Return concise, structured JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Short punchy action title (max 7 words)' },
              category: { type: Type.STRING, enum: ['gear', 'skill', 'economy', 'combat'] },
              why: { type: Type.STRING, description: '1-2 friendly sentences explaining the benefit' },
              expectedImpact: { type: Type.STRING, description: 'Direct tangible outcome for the character' },
              actionSteps: { type: Type.STRING, description: 'Simple instruction on how to execute this in-game' },
              tip: { type: Type.STRING, description: 'Short tactical tip' }
            },
            required: ['title', 'category', 'why', 'expectedImpact', 'actionSteps']
          }
        }
      });

      const parsedAction = JSON.parse(response.text || '{}');
      return res.json({
        source: 'gemini',
        action: parsedAction
      });
    } catch (error: any) {
      console.error('Error generating Gemini next-best-action:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate AI recommendation'
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`War Era Strategy Server running on port ${PORT}`);
  });
}

startServer();
