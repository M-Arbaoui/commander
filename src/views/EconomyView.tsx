import React, { useState } from 'react';
import { PlayerDTO, BuildObjective, Language, MarketPurchaseItem } from '../types';
import { translations } from '../services/localization';
import { VERIFIED_MARKET_ITEMS } from '../services/gameData';
import { Badge } from '../components/Badge';
import {
  Coins,
  TrendingDown,
  TrendingUp,
  Filter,
  DollarSign,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface EconomyViewProps {
  player: PlayerDTO;
  objective: BuildObjective;
  language: Language;
}

export const EconomyView: React.FC<EconomyViewProps> = ({
  player,
  objective,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const t = translations[language];

  const items: MarketPurchaseItem[] = VERIFIED_MARKET_ITEMS;

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  // Sort by efficiency descending
  const sortedItems = [...filteredItems].sort((a, b) => b.efficiency - a.efficiency);

  const getVerdictVariant = (verdict: string): 'gold' | 'emerald' | 'amber' | 'red' | 'gray' => {
    switch (verdict) {
      case 'Buy':
        return 'emerald';
      case 'Wait':
        return 'amber';
      case 'Upgrade Something Else':
        return 'gold';
      case 'Avoid':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f2]">
          {t.economyTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#8e929b] mt-0.5">
          {t.economySubtitle}
        </p>
      </div>

      {/* Treasury & Strategic Principle Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-[#181a1f] border border-[#c5a059]/30 rounded-xl">
          <div className="text-xs text-[#8e929b] mb-1">Available Coin Reserves</div>
          <div className="text-2xl font-bold text-[#c5a059]">
            {player.coins.toLocaleString()} <span className="text-xs font-normal text-[#8e929b]">coins</span>
          </div>
          <div className="text-[11px] text-[#3ba776] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Discretionary surplus available</span>
          </div>
        </div>

        <div className="p-4 bg-[#181a1f] border border-[#2c303a] rounded-xl md:col-span-2 flex flex-col justify-center text-xs text-[#8e929b]">
          <span className="font-semibold text-[#f4f4f2] mb-1">Mathematical Efficiency Formula</span>
          <p className="leading-relaxed">
            <span className="font-mono text-[#c5a059]">Efficiency = Expected Improvement ÷ Coin Cost</span>.
            A stronger item is not automatically a better purchase if the marginal cost eclipses immediate utility.
          </p>
        </div>
      </div>

      {/* Purchase Evaluation Matrix */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f2]">{t.marketOpportunities}</h3>
            <span className="text-xs text-[#8e929b]">Objective: {t.objectives[objective].label}</span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {['All', 'Equipment', 'Pill', 'Consumable'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                    : 'text-[#8e929b] hover:bg-[#111215]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Card list */}
        <div className="space-y-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.verdict === 'Buy'
                  ? 'bg-[#181a1f] border-[#3ba776]/30'
                  : item.verdict === 'Avoid'
                  ? 'bg-[#141519] border-[#c94a4a]/30'
                  : 'bg-[#141519] border-[#2c303a]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#f4f4f2]">{item.name}</h4>
                    <span className="text-[10px] text-[#8e929b] px-1.5 py-0.5 rounded bg-[#111215] border border-[#23262f]">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#3ba776] mt-0.5 font-medium">
                    {item.expectedGain}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getVerdictVariant(item.verdict)} size="md">
                    {t.verdicts[item.verdict] || item.verdict}
                  </Badge>
                </div>
              </div>

              {/* Metrics bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2 px-3 bg-[#111215] rounded-lg border border-[#23262f] text-xs my-3">
                <div>
                  <span className="text-[#8e929b] block text-[11px]">Price:</span>
                  <span className="font-bold text-[#c5a059]">{item.price} coins</span>
                  <span className={`text-[10px] ms-1 ${item.priceTrendPercent < 0 ? 'text-[#3ba776]' : 'text-[#c94a4a]'}`}>
                    {item.priceTrendPercent > 0 ? `+${item.priceTrendPercent}%` : `${item.priceTrendPercent}%`}
                  </span>
                </div>

                <div>
                  <span className="text-[#8e929b] block text-[11px]">Efficiency:</span>
                  <span className="font-bold text-[#f4f4f2]">{(item.efficiency * 100).toFixed(3)} pts</span>
                </div>

                <div className="col-span-2">
                  <span className="text-[#8e929b] block text-[11px]">{t.opportunityCost}:</span>
                  <span className="text-[#d4d6db] text-[11px] truncate block">{item.opportunityCost}</span>
                </div>
              </div>

              {/* Reason */}
              <p className="text-xs text-[#8e929b] leading-relaxed">
                <span className="font-semibold text-[#d4d6db]">{t.reason}: </span>
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
