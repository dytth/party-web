import React, { useState } from 'react';
import { sanitizeRoomCode } from '../utils/roomCode';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import { Footer } from './Footer';

interface JoinViewProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  initialRoomCode?: string;
  onJoin: (roomCode: string, playerName: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export const JoinView: React.FC<JoinViewProps> = ({
  lang,
  onToggleLang,
  initialRoomCode = '',
  onJoin,
  onBack,
  isLoading = false,
  errorMessage = '',
}) => {
  const t = TRANSLATIONS[lang];
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    const cleanCode = sanitizeRoomCode(roomCode);
    const cleanName = playerName.trim();

    if (!cleanCode) {
      setLocalError(t.errorNoRoomCode);
      return;
    }
    if (cleanCode.length !== 4) {
      setLocalError(t.errorInvalidCode);
      return;
    }
    if (!cleanName) {
      setLocalError(t.errorNoName);
      return;
    }

    onJoin(cleanCode, cleanName);
  };

  return (
    <div className="party-shell min-h-screen flex flex-col items-center justify-between p-5 sm:p-6 bg-neutral-50 text-neutral-900">
      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-sm flex justify-end">
        <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
      </div>

      <div className="party-glass w-full max-w-sm rounded-3xl p-6 sm:p-8 my-auto">
        <div className="text-center text-3xl mb-3">✦</div>
        <h1 className="party-brand text-3xl font-black tracking-tight mb-1 text-center">{t.joinTitle}</h1>
        <p className="text-neutral-500 text-sm mb-6 text-center">{t.joinSubtitle}</p>

        {(localError || errorMessage) && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {localError || errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              {t.roomCode}
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(sanitizeRoomCode(e.target.value))}
              placeholder={t.roomCodePlaceholder}
              maxLength={4}
              disabled={isLoading}
              className="w-full text-center text-2xl font-mono font-bold tracking-widest py-3 px-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:bg-white uppercase transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              {t.yourName}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={20}
              disabled={isLoading}
              className="w-full py-3 px-4 text-base bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="party-primary w-full py-3.5 px-6 text-white font-bold rounded-xl transition active:scale-[0.99] disabled:opacity-50 cursor-pointer text-base"
            >
              {isLoading ? t.connecting : t.confirm}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer"
            >
              {t.back}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};
