import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../services/localization';
import { User, Server, Menu, X, Check, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  handle: string;
  onUpdateHandle: (newHandle: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  coins: number;
  level: number;
  avatarUrl?: string;
  isLiveVerified?: boolean;
  isSyncing?: boolean;
  onSyncLiveApi?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  handle,
  onUpdateHandle,
  language,
  onToggleLanguage,
  onOpenMobileMenu,
  isMobileMenuOpen,
  coins,
  level,
  avatarUrl,
  isLiveVerified = true,
  isSyncing = false,
  onSyncLiveApi
}) => {
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [tempHandle, setTempHandle] = useState(handle);
  const t = translations[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempHandle.trim()) {
      onUpdateHandle(tempHandle.trim());
      setIsEditingHandle(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#111215]/95 backdrop-blur border-b border-[#2c303a] px-4 lg:px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Mobile toggle & Brand on mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg bg-[#181a1f] border border-[#2c303a] text-[#8e929b] hover:text-[#f4f4f2] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-base text-[#f4f4f2]">QASWARA</span>
            <span className="text-[10px] text-[#c5a059] border border-[#c5a059]/30 px-1.5 py-0.2 rounded font-mono">v1.0</span>
          </div>
        </div>

        {/* Player Handle Input / Badge */}
        <div className="flex items-center gap-2">
          {isEditingHandle ? (
            <form onSubmit={handleSave} className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempHandle}
                onChange={(e) => setTempHandle(e.target.value)}
                placeholder="War Era Handle"
                className="bg-[#181a1f] border border-[#c5a059]/50 rounded-lg px-3 py-1.5 text-xs text-[#f4f4f2] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 bg-[#c5a059] hover:bg-[#d4af37] text-[#111215] rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingHandle(false)}
                className="p-1.5 bg-[#22252c] text-[#8e929b] hover:text-[#f4f4f2] rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTempHandle(handle);
                  setIsEditingHandle(true);
                }}
                title="Click to edit handle"
                className="flex items-center gap-2.5 px-3 py-1.5 bg-[#181a1f] hover:bg-[#22252c] border border-[#2c303a] rounded-lg text-xs transition-colors cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={handle}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-[#c5a059]/40"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#c5a059]" />
                )}
                <span className="font-semibold text-[#f4f4f2]">{handle}</span>
                <span className="text-[#c5a059] text-[11px] font-mono font-semibold">Lv.{level}</span>
                <span className="text-[10px] text-[#8e929b] border-l border-[#2c303a] pl-2 hidden sm:inline">
                  {coins.toLocaleString()} coins
                </span>
              </button>

              {/* Sync Live API Button */}
              {onSyncLiveApi && (
                <button
                  type="button"
                  onClick={onSyncLiveApi}
                  disabled={isSyncing}
                  title="Refresh from War Era official API"
                  className={`p-1.5 bg-[#181a1f] hover:bg-[#22252c] border border-[#2c303a] rounded-lg text-[#8e929b] hover:text-[#c5a059] transition-colors cursor-pointer ${
                    isSyncing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c5a059]' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* Live API Verified Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181a1f] border border-[#2c303a] text-[11px]">
            {isLiveVerified ? (
              <>
                <ShieldCheck className="w-3 h-3 text-[#3ba776]" />
                <span className="text-[#3ba776] font-medium">War Era Live API</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ba776] animate-pulse"></span>
              </>
            ) : (
              <>
                <Server className="w-3 h-3 text-[#d99b38]" />
                <span className="text-[#8e929b]">Cached Profile</span>
              </>
            )}
          </div>
        </div>

        {/* Right side: Language Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Toggle: Must strictly follow "العربية | EN" without country flags */}
          <div className="flex items-center border border-[#2c303a] rounded-lg bg-[#181a1f] p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onToggleLanguage('ar')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'ar'
                  ? 'bg-[#22252c] text-[#c5a059] font-bold shadow-sm'
                  : 'text-[#8e929b] hover:text-[#f4f4f2]'
              }`}
            >
              العربية
            </button>
            <span className="text-[#2c303a] text-xs">|</span>
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#22252c] text-[#c5a059] font-bold shadow-sm'
                  : 'text-[#8e929b] hover:text-[#f4f4f2]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
