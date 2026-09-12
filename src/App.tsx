import React, { useState, useEffect, useCallback } from 'react';
import {
  AppRoute,
  Language,
  BuildObjective,
  PlayerDTO,
  WarDTO,
  EquipmentSlot
} from './types';
import {
  DEFAULT_PLAYER_PROFILE,
  VERIFIED_WARS_LIST,
  INITIAL_PLAYER_HANDLE,
  BASE_EQUIPMENT_CATALOG
} from './services/gameData';
import { WarEraApiService } from './services/warEraApi';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './views/HomeView';
import { SuggestionsView } from './views/SuggestionsView';
import { WarView } from './views/WarView';
import { BuildView } from './views/BuildView';
import { CombatSimulatorView } from './views/CombatSimulatorView';
import { EconomyView } from './views/EconomyView';
import { ApiDiscoveryView } from './views/ApiDiscoveryView';
import { SettingsView } from './views/SettingsView';
import { GeneratedBuildCard } from './types';

export default function App() {
  // 1. Language state with persistent localStorage and html dir attribute
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('qaswara_lang');
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('qaswara_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // 2. Player handle persistence
  const [handle, setHandle] = useState<string>(() => {
    return localStorage.getItem('qaswara_handle') || INITIAL_PLAYER_HANDLE;
  });

  const [player, setPlayer] = useState<PlayerDTO>(() => {
    return {
      ...DEFAULT_PLAYER_PROFILE,
      username: localStorage.getItem('qaswara_handle') || INITIAL_PLAYER_HANDLE
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Live Sync Function
  const syncLivePlayer = useCallback(async (targetHandle: string) => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const result = await WarEraApiService.fetchPlayerByUsername(targetHandle);
      if (result.success && result.player) {
        setPlayer(result.player);
        setSyncFeedback(`Successfully synced @${targetHandle} from War Era!`);
      } else {
        setSyncFeedback(result.error || 'Player not found on game servers.');
      }
    } catch {
      setSyncFeedback('Unable to reach War Era API. Retaining verified profile.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  }, []);

  // Fetch live on mount
  useEffect(() => {
    syncLivePlayer(handle);
  }, []);

  const handleUpdateHandle = (newHandle: string) => {
    setHandle(newHandle);
    localStorage.setItem('qaswara_handle', newHandle);
    setPlayer((prev) => ({ ...prev, username: newHandle }));
    syncLivePlayer(newHandle);
  };

  // 3. Navigation routing
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4. Strategic Objective state
  const [objective, setObjective] = useState<BuildObjective>('coin_efficiency');

  // 5. War selection state
  const [selectedWar, setSelectedWar] = useState<WarDTO | null>(VERIFIED_WARS_LIST[0]);

  // 6. Preloaded Build for Combat Simulator
  const [selectedBuildForCombat, setSelectedBuildForCombat] = useState<GeneratedBuildCard | null>(null);

  // Handle slot upgrade in player state
  const handleUpgradeSlot = (slot: EquipmentSlot) => {
    const catalog = BASE_EQUIPMENT_CATALOG[slot];
    if (!catalog || catalog.length < 2) return;

    const nextItem = catalog[catalog.length - 1];
    if (player.coins >= nextItem.upgradeCost) {
      setPlayer((prev) => ({
        ...prev,
        coins: prev.coins - nextItem.upgradeCost,
        equipment: {
          ...prev.equipment,
          [slot]: nextItem
        }
      }));
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('qaswara_handle');
    localStorage.removeItem('qaswara_lang');
    setHandle(INITIAL_PLAYER_HANDLE);
    setLanguage('en');
    setPlayer({ ...DEFAULT_PLAYER_PROFILE, username: INITIAL_PLAYER_HANDLE });
    setObjective('coin_efficiency');
    setSelectedWar(VERIFIED_WARS_LIST[0]);
    setCurrentRoute('home');
    syncLivePlayer(INITIAL_PLAYER_HANDLE);
  };

  return (
    <div className="min-h-screen bg-[#111215] text-[#f4f4f2] flex">
      {/* 250px Desktop Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        language={language}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          handle={handle}
          onUpdateHandle={handleUpdateHandle}
          language={language}
          onToggleLanguage={(lang) => setLanguage(lang)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          coins={player.coins}
          level={player.level}
          avatarUrl={player.avatarUrl}
          isLiveVerified={player.isLiveVerified}
          isSyncing={isSyncing}
          onSyncLiveApi={() => syncLivePlayer(handle)}
        />

        {/* Sync Feedback Banner */}
        {syncFeedback && (
          <div className="bg-[#181a1f] border-b border-[#2c303a] px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c5a059]"></span>
            <span className="text-[#d4d6db]">{syncFeedback}</span>
          </div>
        )}

        {/* View Router Container (Max ~1440px) */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {currentRoute === 'home' && (
            <HomeView
              player={player}
              selectedWar={selectedWar}
              objective={objective}
              language={language}
              onNavigateToWar={() => setCurrentRoute('war')}
              onNavigateToBuild={() => setCurrentRoute('build')}
              onNavigateToCombat={() => setCurrentRoute('combat')}
              onNavigateToEconomy={() => setCurrentRoute('economy')}
              onNavigateToSuggestions={() => setCurrentRoute('suggestions')}
            />
          )}

          {currentRoute === 'suggestions' && (
            <SuggestionsView
              player={player}
              language={language}
              selectedWar={selectedWar}
              onUpdatePlayer={(upd) => setPlayer(upd)}
              onNavigateToWar={() => setCurrentRoute('war')}
              onNavigateToEconomy={() => setCurrentRoute('economy')}
            />
          )}

          {currentRoute === 'war' && (
            <WarView
              wars={VERIFIED_WARS_LIST}
              selectedWar={selectedWar}
              onSelectWar={(w) => setSelectedWar(w)}
              player={player}
              language={language}
            />
          )}

          {currentRoute === 'build' && (
            <BuildView
              player={player}
              language={language}
              onNavigateToCombatWithBuild={(b) => {
                setSelectedBuildForCombat(b);
                setCurrentRoute('combat');
              }}
              onSyncProfile={() => syncLivePlayer(handle)}
            />
          )}

          {currentRoute === 'combat' && (
            <CombatSimulatorView
              player={player}
              language={language}
              preloadedBuild={selectedBuildForCombat}
            />
          )}

          {currentRoute === 'economy' && (
            <EconomyView
              player={player}
              objective={objective}
              language={language}
            />
          )}

          {currentRoute === 'api-discovery' && (
            <ApiDiscoveryView language={language} />
          )}

          {currentRoute === 'settings' && (
            <SettingsView
              handle={handle}
              onUpdateHandle={handleUpdateHandle}
              language={language}
              onToggleLanguage={(lang) => setLanguage(lang)}
              onResetData={handleResetData}
              player={player}
              onUpdatePlayer={(upd) => setPlayer(upd)}
              isSyncing={isSyncing}
              onSyncLiveApi={() => syncLivePlayer(handle)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
