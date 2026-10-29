import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { TheLostSpyClientState } from './types';
import { Language, TRANSLATIONS } from '../../utils/i18n';
import { LanguageToggle } from '../../components/LanguageToggle';
import { Footer } from '../../components/Footer';

interface PlayerTheLostSpyProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  clientState: TheLostSpyClientState;
  playerName: string;
  onVote: (targetId: string) => void;
  onGuessWord: (guess: string) => void;
  onChangeName?: (newName: string) => void;
}

export const PlayerTheLostSpy: React.FC<PlayerTheLostSpyProps> = ({
  lang,
  onToggleLang,
  clientState,
  playerName,
  onVote,
  onGuessWord,
  onChangeName,
}) => {
  const t = TRANSLATIONS[lang];
  const [showSecretWord, setShowSecretWord] = useState<boolean>(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>(playerName);

  // Modal for guessing the original word
  const [showGuessModal, setShowGuessModal] = useState<boolean>(false);
  const [guessInput, setGuessInput] = useState<string>('');

  // Reset local vote whenever round changes, stage changes away from VOTE, or server resets hasVoted
  useEffect(() => {
    if (!clientState.hasVoted || clientState.stage !== 'VOTE') {
      setSelectedTargetId(null);
    }
  }, [clientState.hasVoted, clientState.stage, clientState.round]);

  const handleVoteSubmit = (targetId: string) => {
    if (!clientState.isAlive || targetId === clientState.myPlayerId) return;
    setSelectedTargetId(targetId);
    onVote(targetId);
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    onGuessWord(guessInput.trim());
    setGuessInput('');
    setShowGuessModal(false);
  };

  const isVoted = Boolean(clientState.hasVoted || (selectedTargetId && clientState.stage === 'VOTE'));
  const canGuess = clientState.isAlive && (clientState.stage === 'DESCRIBE' || clientState.stage === 'VOTE');

  // Word presentation based on selected language
  const primaryWord = lang === 'en' ? (clientState.myWordEn || clientState.myWord) : clientState.myWord;
  const secondaryWord = lang === 'en' ? clientState.myWord : clientState.myWordEn;

  return (
    <div className="party-shell min-h-screen bg-neutral-50 text-neutral-900 p-5 flex flex-col justify-between max-w-md mx-auto relative">
      {/* Top Header */}
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {t.game1Title} • {t.round} {clientState.round}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-neutral-900">{playerName}</span>
            {onChangeName && (
              <button
                type="button"
                onClick={() => {
                  setInputName(playerName);
                  setEditingName(true);
                }}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition cursor-pointer"
                title={t.changeName}
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!clientState.isAlive && (
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              {t.spectatorBadge}
            </span>
          )}
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
        </div>
      </div>

      {/* Global Live Announcement Banner */}
      {clientState.announcement && (() => {
        const annTitle =
          lang === 'en'
            ? clientState.announcement.titleEn || clientState.announcement.title || clientState.announcement.titleVi
            : clientState.announcement.titleVi || clientState.announcement.title || clientState.announcement.titleEn;
        const annMessage =
          lang === 'en'
            ? clientState.announcement.messageEn || clientState.announcement.message || clientState.announcement.messageVi
            : clientState.announcement.messageVi || clientState.announcement.message || clientState.announcement.messageEn;

        return (
          <div
            className={`mt-3 p-3.5 rounded-xl border text-sm text-left shadow-xs ${
              clientState.announcement.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-900'
                : clientState.announcement.type === 'success'
                ? 'bg-neutral-900 border-neutral-900 text-white'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="font-bold text-xs uppercase tracking-wider mb-1">
              {annTitle}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-line">{annMessage}</div>
          </div>
        );
      })()}

      {/* Main Body */}
      <div className="my-auto py-6">
        {/* ==================================================== */}
        {/* STAGE 1: MEMORIZE (15s) */}
        {/* ==================================================== */}
        {clientState.stage === 'MEMORIZE' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {t.yourSecretWord}
              </span>
              {clientState.nature && (
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                  {lang === 'vi' ? `Bản chất: ${clientState.nature}` : `Nature: ${clientState.nature}`}
                </span>
              )}
            </div>

            <div className="py-6 px-4 bg-neutral-50 border border-neutral-200 rounded-xl my-4">
              <div className="text-3xl font-black text-neutral-900 tracking-wide">
                {primaryWord}
              </div>
              {secondaryWord && secondaryWord !== primaryWord && (
                <div className="text-sm text-neutral-500 font-medium mt-1">
                  ({secondaryWord})
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              {t.keepSecretPhone}
            </p>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 2: DESCRIBE (Turn-based) */}
        {/* ==================================================== */}
        {clientState.stage === 'DESCRIBE' && (
          <div className="space-y-4">
            {clientState.isMyTurn ? (
              <div className="bg-black text-white rounded-2xl p-6 text-center shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  {t.attention}
                </span>
                <h2 className="text-2xl font-black tracking-tight mb-3">
                  {t.yourTurnToDescribe}
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {t.yourTurnDescribeSub}
                </p>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                  {t.nowHappening}
                </span>
                <p className="text-sm text-neutral-500 mb-1">{t.turnOfPlayer}</p>
                <div className="text-2xl font-bold text-neutral-900 mb-4">
                  {clientState.currentSpeakerName || '...'}
                </div>
                <p className="text-xs text-neutral-400">
                  {t.listenCarefullyNotice}
                </p>
              </div>
            )}

            {/* Hold to Reveal Secret Word */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center">
              <span className="text-xs text-neutral-400 block mb-2">{t.forgotWord}</span>
              <button
                type="button"
                onMouseDown={() => setShowSecretWord(true)}
                onMouseUp={() => setShowSecretWord(false)}
                onTouchStart={() => setShowSecretWord(true)}
                onTouchEnd={() => setShowSecretWord(false)}
                className="w-full py-3 px-4 bg-neutral-100 active:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-xl border border-neutral-200 select-none cursor-pointer"
              >
                {showSecretWord ? (
                  <span className="text-base font-bold text-black">
                    {primaryWord} {secondaryWord && `(${secondaryWord})`}
                  </span>
                ) : (
                  t.holdToReveal
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 3: VOTE */}
        {/* ==================================================== */}
        {clientState.stage === 'VOTE' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              {t.eliminationVote}
            </span>
            <h2 className="text-xl font-bold mb-4">{t.whoIsSpy}</h2>

            {!clientState.isAlive ? (
              <div className="py-6 text-neutral-400 text-sm">
                {t.votedSpectatorNotice}
              </div>
            ) : isVoted ? (
              <div className="py-8 bg-neutral-50 border border-neutral-200 rounded-xl">
                <div className="text-green-600 font-semibold text-sm mb-1">{t.voteSubmittedSuccess}</div>
                <p className="text-xs text-neutral-500">
                  {t.lookAtHostWaitForResult}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 text-left">
                <p className="text-xs text-neutral-500 mb-3 text-center">
                  {t.chooseSuspectPrompt}
                </p>
                {clientState.alivePlayers.filter((player) => player.id !== clientState.myPlayerId).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleVoteSubmit(player.id)}
                    className="w-full p-3.5 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-200 rounded-xl font-semibold text-neutral-900 transition flex items-center justify-between text-base cursor-pointer"
                  >
                    <span>{player.name}</span>
                    <span className="text-xs text-neutral-400 font-normal">{t.castVoteBtn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 4: RESULT */}
        {/* ==================================================== */}
        {clientState.stage === 'RESULT' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              {t.resultStage}
            </span>
            <div className="text-2xl font-bold text-neutral-900 my-3">
              {clientState.eliminatedName}
            </div>
            <div
              className={`text-sm font-semibold p-3 rounded-xl mb-4 ${
                clientState.eliminatedWasSpy || clientState.winner === 'SPY'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {clientState.eliminatedWasSpy
                ? t.wasSpyClient
                : clientState.winner === 'SPY'
                ? t.wasInnocentSpyWinsClient
                : t.wasInnocentClient}
            </div>
            <p className="text-xs text-neutral-500">
              {t.lookAtHostWaitForResult}
            </p>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 5: GAME_OVER */}
        {/* ==================================================== */}
        {clientState.stage === 'GAME_OVER' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              {t.gameOverStage}
            </span>
            <h2 className="text-2xl font-black text-neutral-900 my-4">
              {clientState.winner === 'CIVILIANS' ? t.civiliansWin : t.spyWins}
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              {t.lookAtHostWaitForResult}
            </p>
          </div>
        )}
      </div>

      {/* GUESS KEYWORD BUTTON (ONLY WHEN ALIVE & PLAYING) */}
      {canGuess && (
        <div className="pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setShowGuessModal(true)}
            className="w-full py-3 px-4 bg-white border-2 border-neutral-900 text-neutral-900 font-bold text-sm rounded-xl hover:bg-neutral-900 hover:text-white transition active:scale-[0.99] cursor-pointer"
          >
            {t.guessWordBtn}
          </button>
        </div>
      )}

      {/* MODAL: GUESS KEYWORD */}
      {showGuessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-neutral-900">{t.guessWordModalTitle}</h3>
              <button
                onClick={() => setShowGuessModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 leading-relaxed">
              <strong>{t.guessWordWarning}</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>{t.guessWordWarning1}</li>
                <li>{t.guessWordWarning2}</li>
              </ul>
            </div>

            <form onSubmit={handleGuessSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  {t.guessInputLabel}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder={t.guessInputPlaceholder}
                  className="w-full py-3 px-4 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-black focus:bg-white text-base"
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGuessModal(false)}
                  className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition text-sm cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!guessInput.trim()}
                  className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition disabled:opacity-50 text-sm cursor-pointer"
                >
                  {t.submitGuess}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-neutral-900 font-semibold mb-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const trimmed = inputName.trim().slice(0, 15);
                  if (trimmed && onChangeName) onChangeName(trimmed);
                  setEditingName(false);
                }
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
                onClick={() => {
                  const trimmed = inputName.trim().slice(0, 15);
                  if (trimmed && onChangeName) onChangeName(trimmed);
                  setEditingName(false);
                }}
                disabled={!inputName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-black text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
              >
                {t.saveName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <Footer
        label={`${t.game1Title} • Circus Cyber Party`}
        className="mt-3"
      />
    </div>
  );
};
