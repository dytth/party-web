import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import { Footer } from './Footer';

interface PlayerWaitingViewProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  roomCode: string;
  playerName: string;
  isReconnecting?: boolean;
  reconnectAttempt?: number;
  onLeaveRoom: () => void;
  onChangeName?: (newName: string) => void;
}

export const PlayerWaitingView: React.FC<PlayerWaitingViewProps> = ({
  lang,
  onToggleLang,
  roomCode,
  playerName,
  isReconnecting = false,
  reconnectAttempt = 1,
  onLeaveRoom,
  onChangeName,
}) => {
  const t = TRANSLATIONS[lang];
  const [editingName, setEditingName] = useState(false);
  const [inputName, setInputName] = useState(playerName);

  const handleSaveName = () => {
    const trimmed = inputName.trim().slice(0, 15);
    if (!trimmed || trimmed === playerName) {
      setEditingName(false);
      return;
    }
    if (onChangeName) {
      onChangeName(trimmed);
    }
    setEditingName(false);
  };

  return (
    <div className="party-shell min-h-screen flex flex-col items-center justify-between p-5 sm:p-6 bg-neutral-50 text-neutral-900">
      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-sm flex justify-end">
        <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
      </div>

      <div className="party-glass w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center my-auto">
        {/* Status Badge */}
        {isReconnecting ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200 mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {t.reconnecting} ({reconnectAttempt}/10)...
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {t.online}
          </div>
        )}

        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 grid place-items-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl shadow-xl party-float">✓</div>
        <h1 className="party-brand text-3xl font-black tracking-tight mb-1">
          {isReconnecting ? t.connectionLost : t.joinedSuccessTitle}
        </h1>
        <p className="text-neutral-500 text-sm mb-6">
          {isReconnecting ? t.reconnectingSub : t.readyToPlaySub}
        </p>

        {/* Room & Player Card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left space-y-2 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">{t.roomCode}:</span>
            <span className="font-mono font-bold text-neutral-900">{roomCode}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">{t.yourName}:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">{playerName}</span>
              {onChangeName && (
                <button
                  type="button"
                  onClick={() => {
                    setInputName(playerName);
                    setEditingName(true);
                  }}
                  className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 transition flex items-center gap-1 cursor-pointer active:scale-95"
                  title={t.changeName}
                >
                  <Edit2 size={11} />
                  <span>{t.changeName}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Name Modal */}
        {editingName && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-left shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95">
              <h3 className="font-black text-lg text-neutral-900 mb-1">{t.changeNameTitle}</h3>
              <p className="text-xs text-neutral-500 mb-4">{t.namePlaceholder}</p>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                maxLength={15}
                autoFocus
                placeholder={t.changeNamePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-neutral-900 font-semibold mb-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
              />
              <div className="flex justify-between items-center text-[11px] text-neutral-400 mb-4">
                <span>{inputName.trim().length}/15</span>
                {inputName.trim().length === 0 && <span className="text-rose-500">{t.errorNoName}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold text-xs hover:bg-neutral-50 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={!inputName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
                >
                  {t.saveName}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="py-4 text-sm text-neutral-600 bg-neutral-100/70 rounded-xl mb-6">
          {isReconnecting ? t.hostReloadNotice : t.lookAtHostScreen}
        </div>

        <button
          onClick={onLeaveRoom}
          className="text-sm text-neutral-400 hover:text-red-600 transition cursor-pointer"
        >
          {t.leaveRoom}
        </button>
      </div>

      <Footer />
    </div>
  );
};
