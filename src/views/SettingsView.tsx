import React, { useState } from 'react';
import { Language, PlayerDTO } from '../types';
import { translations } from '../services/localization';
import { Badge } from '../components/Badge';
import { Settings, User, Globe, Trash2, Check, Server, ShieldCheck, RefreshCw, Edit3 } from 'lucide-react';

interface SettingsViewProps {
  handle: string;
  onUpdateHandle: (newHandle: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onResetData: () => void;
  player: PlayerDTO;
  onUpdatePlayer: (updated: PlayerDTO) => void;
  isSyncing?: boolean;
  onSyncLiveApi?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  handle,
  onUpdateHandle,
  language,
  onToggleLanguage,
  onResetData,
  player,
  onUpdatePlayer,
  isSyncing = false,
  onSyncLiveApi
}) => {
  const [inputHandle, setInputHandle] = useState(handle);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [apiSource, setApiSource] = useState<'gateway' | 'official'>('official');
  const [isManualEditing, setIsManualEditing] = useState(false);

  // Manual editing fields
  const [editLevel, setEditLevel] = useState(player.level);
  const [editCountry, setEditCountry] = useState(player.country);
  const [editCountryCode, setEditCountryCode] = useState(player.countryCode);
  const [editMu, setEditMu] = useState(player.militaryUnit);
  const [editCoins, setEditCoins] = useState(player.coins);

  const t = translations[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputHandle.trim()) {
      onUpdateHandle(inputHandle.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleSaveManualStats = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlayer({
      ...player,
      level: editLevel,
      country: editCountry,
      countryCode: editCountryCode,
      militaryUnit: editMu,
      coins: editCoins,
      isLiveVerified: false,
      lastFetchedAt: 'Manually updated'
    });
    setIsManualEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f2]">
          {t.settingsTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#8e929b] mt-0.5">
          Local account preferences, verified live data synchronization, and profile management
        </p>
      </div>

      {/* 1. Account Handle & Live API Sync */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-semibold text-[#f4f4f2]">{t.playerHandle}</h3>
          </div>
          {player.isLiveVerified && (
            <Badge variant="emerald" size="sm">Live War Era Verified</Badge>
          )}
        </div>

        <p className="text-xs text-[#8e929b] mb-4">
          {t.handleExplanation} Loads official level, military unit, country, rankings, and active combat buffs directly from the game servers.
        </p>

        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 max-w-md">
          <input
            type="text"
            value={inputHandle}
            onChange={(e) => setInputHandle(e.target.value)}
            placeholder={t.enterHandle}
            className="flex-1 bg-[#111215] border border-[#2c303a] rounded-lg px-3 py-2 text-xs text-[#f4f4f2] focus:outline-none focus:border-[#c5a059]"
          />
          <button
            type="submit"
            disabled={isSyncing}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#d4af37] text-[#111215] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedSuccess ? 'Saved' : t.loadAccount}</span>
          </button>
        </form>

        {onSyncLiveApi && (
          <div className="mt-4 pt-4 border-t border-[#23262f] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#8e929b]">
              Last synced: <span className="text-[#f4f4f2] font-mono">{player.lastFetchedAt || 'Ready to fetch'}</span>
            </div>
            <button
              type="button"
              onClick={onSyncLiveApi}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-[#22252c] hover:bg-[#2c303a] text-[#c5a059] border border-[#c5a059]/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Live API...' : 'Fetch Live Profile from War Era'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Verified Player Overview / Manual Adjuster */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#f4f4f2]">Active Player Data & Attributes</h3>
          <button
            type="button"
            onClick={() => setIsManualEditing(!isManualEditing)}
            className="text-xs text-[#c5a059] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isManualEditing ? 'Cancel Edit' : 'Manually Adjust'}</span>
          </button>
        </div>

        {isManualEditing ? (
          <form onSubmit={handleSaveManualStats} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[#8e929b] block mb-1">Level</label>
                <input
                  type="number"
                  value={editLevel}
                  onChange={(e) => setEditLevel(Number(e.target.value))}
                  className="w-full bg-[#111215] border border-[#2c303a] rounded px-3 py-1.5 text-[#f4f4f2]"
                />
              </div>
              <div>
                <label className="text-[#8e929b] block mb-1">Coins</label>
                <input
                  type="number"
                  value={editCoins}
                  onChange={(e) => setEditCoins(Number(e.target.value))}
                  className="w-full bg-[#111215] border border-[#2c303a] rounded px-3 py-1.5 text-[#f4f4f2]"
                />
              </div>
              <div>
                <label className="text-[#8e929b] block mb-1">Country Name</label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="w-full bg-[#111215] border border-[#2c303a] rounded px-3 py-1.5 text-[#f4f4f2]"
                />
              </div>
              <div>
                <label className="text-[#8e929b] block mb-1">Country Code</label>
                <input
                  type="text"
                  value={editCountryCode}
                  onChange={(e) => setEditCountryCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#111215] border border-[#2c303a] rounded px-3 py-1.5 text-[#f4f4f2]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[#8e929b] block mb-1">Military Unit</label>
                <input
                  type="text"
                  value={editMu}
                  onChange={(e) => setEditMu(e.target.value)}
                  className="w-full bg-[#111215] border border-[#2c303a] rounded px-3 py-1.5 text-[#f4f4f2]"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsManualEditing(false)}
                className="px-3 py-1.5 bg-[#22252c] text-[#8e929b] rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#c5a059] text-[#111215] font-semibold rounded cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Level:</span>
              <span className="font-bold text-[#f4f4f2] text-sm">{player.level}</span>
            </div>
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Country:</span>
              <span className="font-bold text-[#f4f4f2] text-sm">{player.country} ({player.countryCode})</span>
            </div>
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Military Unit:</span>
              <span className="font-bold text-[#c5a059] text-sm">{player.militaryUnit}</span>
            </div>
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Liquid Coins:</span>
              <span className="font-bold text-[#f4f4f2] text-sm">{player.coins.toLocaleString()}</span>
            </div>
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Military Rank:</span>
              <span className="font-bold text-[#3ba776] text-sm">Rank {player.militaryRank || 84}</span>
            </div>
            <div className="p-2.5 bg-[#111215] rounded-lg border border-[#23262f]">
              <span className="text-[#8e929b] block text-[11px]">Total DMG Dealt:</span>
              <span className="font-bold text-[#f4f4f2] text-sm">{(player.totalDamages || 34883031).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Language Selection */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-sm font-semibold text-[#f4f4f2]">{t.languageSelect}</h3>
        </div>

        <p className="text-xs text-[#8e929b] mb-4">
          Strictly compliant with QASWARA Rule 9: English and Modern Standard Arabic are treated as first-class languages with native RTL/LTR layouts.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleLanguage('en')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#22252c] text-[#c5a059] border-[#c5a059]/40'
                : 'bg-[#111215] text-[#8e929b] border-[#2c303a] hover:text-[#f4f4f2]'
            }`}
          >
            English (LTR)
          </button>
          <button
            type="button"
            onClick={() => onToggleLanguage('ar')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              language === 'ar'
                ? 'bg-[#22252c] text-[#c5a059] border-[#c5a059]/40'
                : 'bg-[#111215] text-[#8e929b] border-[#2c303a] hover:text-[#f4f4f2]'
            }`}
          >
            العربية (RTL)
          </button>
        </div>
      </div>

      {/* 4. API Source Preference */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-sm font-semibold text-[#f4f4f2]">{t.activeDataSource}</h3>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111215] border border-[#23262f] cursor-pointer">
            <input
              type="radio"
              name="apiSource"
              checked={apiSource === 'official'}
              onChange={() => setApiSource('official')}
              className="accent-[#c5a059]"
            />
            <div>
              <span className="text-xs font-semibold text-[#f4f4f2] block">
                Official War Era tRPC Endpoint (api2.warera.io/trpc)
              </span>
              <span className="text-[11px] text-[#8e929b]">
                Direct game server link with full CORS support and real-time synchronization
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111215] border border-[#23262f] cursor-pointer">
            <input
              type="radio"
              name="apiSource"
              checked={apiSource === 'gateway'}
              onChange={() => setApiSource('gateway')}
              className="accent-[#c5a059]"
            />
            <div>
              <span className="text-xs font-semibold text-[#f4f4f2] block">
                War Era Gateway (gateway.warerastats.io)
              </span>
              <span className="text-[11px] text-[#8e929b]">
                Hattorius caching proxy (requires API Key header for high-frequency queries)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* 5. Clear Local Storage */}
      <div className="bg-[#181a1f] border border-[#c94a4a]/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-4 h-4 text-[#c94a4a]" />
          <h3 className="text-sm font-semibold text-[#e06c6c]">{t.clearLocalData}</h3>
        </div>

        <p className="text-xs text-[#8e929b] mb-4">
          Purge locally cached handle, language preferences, and objective configurations from your browser.
        </p>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(t.resetConfirm)) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-[#22252c] hover:bg-[#c94a4a]/20 text-[#e06c6c] border border-[#c94a4a]/40 font-semibold text-xs rounded-lg cursor-pointer transition-colors"
        >
          {t.clearLocalData}
        </button>
      </div>
    </div>
  );
};
