import React from 'react';
import { AppRoute, Language } from '../types';
import { translations } from '../services/localization';
import { Badge } from './Badge';
import {
  LayoutDashboard,
  Swords,
  Hammer,
  Coins,
  Users,
  Shield,
  Globe,
  Settings,
  BookOpen,
  Crosshair,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  language: Language;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  language,
  isOpenMobile,
  onCloseMobile
}) => {
  const t = translations[language];

  interface NavItem {
    id: AppRoute;
    label: string;
    icon: React.ReactNode;
    isComingSoon?: boolean;
  }

  const primaryNavItems: NavItem[] = [
    { id: 'suggestions', label: language === 'ar' ? 'اقتراحات ذكية' : 'Smart Suggestions', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'home', label: t.navHome, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'build', label: t.navBuild, icon: <Hammer className="w-4 h-4" /> },
    { id: 'war', label: t.navWar, icon: <Swords className="w-4 h-4" /> },
    { id: 'economy', label: t.navEconomy, icon: <Coins className="w-4 h-4" /> },
    { id: 'combat', label: language === 'ar' ? 'اختبار قتالي' : 'Combat Check', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'api-discovery', label: t.navApiDiscovery, icon: <BookOpen className="w-4 h-4" /> }
  ];

  const futureNavItems: NavItem[] = [
    { id: 'players', label: t.navPlayers, icon: <Users className="w-4 h-4" />, isComingSoon: true },
    { id: 'military-unit', label: t.navMilitaryUnit, icon: <Shield className="w-4 h-4" />, isComingSoon: true },
    { id: 'country', label: t.navCountry, icon: <Globe className="w-4 h-4" />, isComingSoon: true }
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-[#14151a] border-inline-end border-[#2c303a]">
      {/* Top Brand */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-[#23262f] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22252c] border border-[#c5a059]/40 flex items-center justify-center font-bold text-sm text-[#c5a059]">
              Q
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wider text-[#f4f4f2] leading-none">
                QASWARA
              </h1>
              <span className="text-[11px] text-[#8e929b] tracking-normal block mt-1">
                Strategy Companion
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-[#8e929b] hover:text-[#f4f4f2] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Core Navigation */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8e929b] px-3 py-1">
            Core Modules
          </div>
          {primaryNavItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-start cursor-pointer ${
                  isActive
                    ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30 shadow-sm'
                    : 'text-[#d4d6db] hover:bg-[#1a1c22] hover:text-[#f4f4f2]'
                }`}
              >
                <span className={isActive ? 'text-[#c5a059]' : 'text-[#8e929b]'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Future Modules - visibly marked as unavailable without pretending to work */}
        <div className="space-y-1 mt-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8e929b] px-3 py-1">
            {t.comingSoon}
          </div>
          {futureNavItems.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#5a5f6d] bg-transparent opacity-60 cursor-not-allowed select-none"
              title="Scheduled in Roadmap Phase 8-10"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#5a5f6d]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#181a1f] border border-[#23262f] text-[#8e929b]">
                {t.comingSoon}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section: Settings & Creator Info */}
      <div className="pt-4 border-t border-[#23262f] space-y-3">
        <button
          type="button"
          onClick={() => {
            onNavigate('settings');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-start cursor-pointer ${
            currentRoute === 'settings'
              ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
              : 'text-[#8e929b] hover:bg-[#1a1c22] hover:text-[#f4f4f2]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.navSettings}</span>
        </button>

        <div className="px-3 py-2 rounded-lg bg-[#111215] border border-[#23262f] text-[11px] text-[#8e929b]">
          <div className="text-[#d4d6db] font-medium">{t.builtBy}</div>
          <div className="text-[10px] text-[#8e929b] mt-0.5">
            Unit: <span className="text-[#c5a059]">MAR ROYAL ARMY</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar: 250px */}
      <aside className="hidden lg:block w-[250px] flex-shrink-0 min-h-screen sticky top-0 self-start h-screen">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
