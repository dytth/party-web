import React, { useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Radio, Sparkles, UserX } from 'lucide-react';
import { Player } from '../types';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import { HostAudioToggle } from './HostAudioToggle';
import { Footer } from './Footer';
import { playHostSound } from '../utils/sound';

interface HostLobbyViewProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  roomCode: string;
  players: Player[];
  onStart: () => void;
  onCloseRoom: () => void;
  onKickPlayer: (playerId: string) => void;
}

export const HostLobbyView: React.FC<HostLobbyViewProps> = ({
  lang,
  onToggleLang,
  roomCode,
  players,
  onStart,
  onCloseRoom,
  onKickPlayer,
}) => {
  const t = TRANSLATIONS[lang];
  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const [preferPublicDomain, setPreferPublicDomain] = React.useState(isLocalHost);
  const productionUrl = `https://party.circuscyber.com?join=${roomCode}`;
  const currentOriginUrl = `${window.location.origin}${window.location.pathname}?join=${roomCode}`;
  const joinUrl = (isLocalHost && preferPublicDomain) ? productionUrl : currentOriginUrl;

  const prevPlayersCount = useRef(players.length);

  useEffect(() => {
    if (players.length > prevPlayersCount.current) {
      playHostSound('pop');
    }
    prevPlayersCount.current = players.length;
  }, [players.length]);

  const handleStart = () => {
    playHostSound('start');
    onStart();
  };

  return (
    <div className="party-shell min-h-screen bg-neutral-50 text-neutral-900 p-5 sm:p-10 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 max-w-6xl mx-auto w-full gap-4">
        <div>
          <span className="party-kicker">
            <Sparkles size={14} /> {t.hostRole}
          </span>
          <h1 className="party-brand text-2xl sm:text-4xl font-black mt-1">{t.lobbyTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <HostAudioToggle />
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
          <button
            onClick={onCloseRoom}
            className="text-sm font-semibold text-slate-400 hover:text-rose-300 transition px-3 py-2 rounded-xl border border-white/10 hover:border-rose-400/30 cursor-pointer"
          >
            {t.closeRoom}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-stretch">
        {/* Left Column: Room Code & QR */}
        <div className="party-glass rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            {t.joinCodeHeader}
          </span>
          <div className="party-brand text-5xl sm:text-7xl font-black tracking-[0.16em] my-3 font-mono pl-[0.16em]">
            {roomCode}
          </div>
          <p className="text-sm text-neutral-500 mb-6">
            {t.scanQrHint}
          </p>

          <div className="qr-frame p-4 rounded-2xl border shadow-xs mb-3 party-pulse">
            <QRCodeSVG value={joinUrl} size={180} level="M" />
          </div>

          <span className="text-xs text-neutral-400">
            {t.scanQrSub}
          </span>

          {isLocalHost && (
            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-400/30 rounded-xl text-[11px] text-amber-300 text-center max-w-xs">
              <span>💡 Link QR quét từ điện thoại:</span>
              <button
                type="button"
                onClick={() => setPreferPublicDomain(!preferPublicDomain)}
                className="block font-mono text-[10px] text-cyan-300 underline mt-0.5 break-all cursor-pointer hover:text-cyan-200"
              >
                {preferPublicDomain ? 'Đang dùng link Cloudflare Pages (Khuyên dùng)' : 'Đang dùng link Localhost'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Players List & Start Action */}
        <div className="party-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <h2 className="font-semibold text-lg">{t.joinedPlayers}</h2>
              <span className="party-chip text-sm font-bold px-3 py-1.5 rounded-full">
                {players.length}/20 {lang === 'vi' ? 'người' : 'players'}
              </span>
            </div>

            {players.length === 0 ? (
              <div className="py-14 text-center text-neutral-400 text-sm flex flex-col items-center gap-3">
                <Radio size={28} className="text-cyan-300 animate-pulse" />
                {t.waitingForPlayers}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3 border rounded-xl font-medium text-sm truncate flex items-center justify-between ${
                      p.isOnline === false
                        ? 'bg-neutral-100/50 border-dashed border-neutral-300 text-neutral-400'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center min-w-0 mr-2 gap-2"><span className="avatar-orb">{p.name.slice(0, 1).toUpperCase()}</span><span className="truncate">{p.name}</span></div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.isOnline === false && (
                        <span className="text-[11px] text-neutral-400 font-normal">
                          {lang === 'vi' ? 'mất kết nối' : 'offline'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const confirmMsg = t.kickConfirm.replace('{name}', p.name);
                          if (window.confirm(confirmMsg)) {
                            onKickPlayer(p.id);
                          }
                        }}
                        title={t.kickPlayer}
                        className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start Button: ALWAYS enabled per requirement */}
          <div className="pt-6 border-t border-neutral-100 mt-6">
            <button
              onClick={handleStart}
              className="party-primary w-full py-4 px-6 text-white text-lg font-bold rounded-2xl transition active:scale-[0.99] cursor-pointer"
            >
              {t.startGame}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-2">
              {t.startGameHint}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <Footer label={t.p2pFooter} />
    </div>
  );
};
