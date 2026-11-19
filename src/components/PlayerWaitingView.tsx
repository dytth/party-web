import React from 'react';
import { MAX_CONNECTION_RETRIES } from '../utils/ice';
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
}

export const PlayerWaitingView: React.FC<PlayerWaitingViewProps> = ({
  lang,
  onToggleLang,
  roomCode,
  playerName,
  isReconnecting = false,
  reconnectAttempt = 1,
  onLeaveRoom,
}) => {
  const t = TRANSLATIONS[lang];

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
            {t.reconnecting} ({reconnectAttempt}/{MAX_CONNECTION_RETRIES})...
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
            <span className="font-semibold text-neutral-900">{playerName}</span>
          </div>
        </div>

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
