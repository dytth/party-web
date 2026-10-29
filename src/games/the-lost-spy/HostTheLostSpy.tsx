import React, { useState, useEffect, useRef } from 'react';
import { UserX, Users, X } from 'lucide-react';
import { TheLostSpyGameState } from './types';
import { Language, TRANSLATIONS } from '../../utils/i18n';
import { LanguageToggle } from '../../components/LanguageToggle';
import { HostAudioToggle } from '../../components/HostAudioToggle';
import { Footer } from '../../components/Footer';
import { LOST_SPY_RULES } from './config';
import { playHostSound } from '../../utils/sound';

interface HostTheLostSpyProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  gameState: TheLostSpyGameState;
  onNextTurn: () => void;
  onStartVoting: () => void;
  onRevealResult: () => void;
  onNextRound: () => void;
  onPlayAgain: () => void;
  onExitGame: () => void;
  onKickPlayer?: (playerId: string) => void;
}

export const HostTheLostSpy: React.FC<HostTheLostSpyProps> = ({
  lang,
  onToggleLang,
  gameState,
  onNextTurn,
  onStartVoting,
  onRevealResult,
  onNextRound,
  onPlayAgain,
  onExitGame,
  onKickPlayer,
}) => {
  const t = TRANSLATIONS[lang];
  const [countdown, setCountdown] = useState<number>(LOST_SPY_RULES.memorizeSeconds);
  const [showPlayersModal, setShowPlayersModal] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.stage === 'MEMORIZE') {
      setCountdown(LOST_SPY_RULES.memorizeSeconds);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            playHostSound('timeup');
            onNextTurn();
            return 0;
          }
          if (prev <= 6) {
            playHostSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.stage, onNextTurn]);

  const currentSpeakerId = gameState.turnOrder[gameState.currentTurnIndex];
  const currentSpeaker = currentSpeakerId ? gameState.playerRoles[currentSpeakerId] : null;
  const isLastTurn = gameState.currentTurnIndex >= gameState.turnOrder.length - 1;

  const alivePlayers = Object.values(gameState.playerRoles).filter((p) => p.isAlive);
  const totalVotesReceived = Object.keys(gameState.votes).length;
  const allAlivePlayersVoted = alivePlayers.length > 0 && totalVotesReceived === alivePlayers.length;

  const prevSpeakerRef = useRef(currentSpeakerId);
  const prevVotesRef = useRef(totalVotesReceived);
  const prevStageRef = useRef(gameState.stage);

  useEffect(() => {
    if (prevStageRef.current !== gameState.stage) {
      if (gameState.stage === 'MEMORIZE') {
        playHostSound('start');
      } else if (gameState.stage === 'DESCRIBE') {
        playHostSound('turn');
      } else if (gameState.stage === 'VOTE') {
        playHostSound('clue');
      } else if (gameState.stage === 'RESULT') {
        const elimId = gameState.eliminatedId;
        if (elimId && gameState.playerRoles[elimId]?.role === 'SPY') {
          playHostSound('correct');
        } else {
          playHostSound('wrong');
        }
      } else if (gameState.stage === 'GAME_OVER') {
        playHostSound('cheer');
      }
      prevStageRef.current = gameState.stage;
    }
  }, [gameState.stage, gameState.eliminatedId, gameState.playerRoles]);

  useEffect(() => {
    if (gameState.stage === 'DESCRIBE' && prevSpeakerRef.current !== currentSpeakerId) {
      playHostSound('turn');
      prevSpeakerRef.current = currentSpeakerId;
    }
  }, [currentSpeakerId, gameState.stage]);

  useEffect(() => {
    if (gameState.stage === 'VOTE' && totalVotesReceived > prevVotesRef.current) {
      playHostSound('pop');
    }
    prevVotesRef.current = totalVotesReceived;
  }, [totalVotesReceived, gameState.stage]);
  const stageSteps = [
    { id: 'MEMORIZE', label: t.memorizeStage },
    { id: 'DESCRIBE', label: t.describeStage },
    { id: 'VOTE', label: t.voteStage },
    { id: 'RESULT', label: t.resultStage },
  ];
  const activeStageIndex = gameState.stage === 'GAME_OVER'
    ? stageSteps.length
    : stageSteps.findIndex((step) => step.id === gameState.stage);

  return (
    <div className="party-shell min-h-screen bg-neutral-50 text-neutral-900 p-5 sm:p-10 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 max-w-4xl mx-auto w-full">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {t.game1Title} • {t.round} {gameState.round}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">
            {gameState.stage === 'MEMORIZE' && t.memorizeStage}
            {gameState.stage === 'DESCRIBE' && t.describeStage}
            {gameState.stage === 'VOTE' && t.voteStage}
            {gameState.stage === 'RESULT' && t.resultStage}
            {gameState.stage === 'GAME_OVER' && t.gameOverStage}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {onKickPlayer && (
            <button
              onClick={() => setShowPlayersModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 transition cursor-pointer shadow-xs"
            >
              <Users size={16} />
              <span className="hidden sm:inline">{t.playerListModalTitle}</span>
              <span className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded-full font-bold">
                {alivePlayers.length}/{Object.keys(gameState.playerRoles).length}
              </span>
            </button>
          )}
          <HostAudioToggle />
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
          <button
            onClick={onExitGame}
            className="text-sm font-medium text-neutral-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-red-200 cursor-pointer"
          >
            {t.stopGame}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full mt-4 grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="Game progress">
        {stageSteps.map((step, index) => (
          <div key={step.id} className="min-w-0">
            <div className={`h-1.5 rounded-full transition-all ${index <= activeStageIndex ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-white/10'}`} />
            <span className={`hidden sm:block text-[10px] uppercase tracking-wider font-bold mt-1.5 truncate ${index === activeStageIndex ? 'text-cyan-300' : 'text-slate-500'}`}>{step.label}</span>
          </div>
        ))}
      </div>

      {/* Live Announcement Banner on Host */}
      {gameState.announcement && (() => {
        const annTitle =
          lang === 'en'
            ? gameState.announcement.titleEn || gameState.announcement.title || gameState.announcement.titleVi
            : gameState.announcement.titleVi || gameState.announcement.title || gameState.announcement.titleEn;
        const annMessage =
          lang === 'en'
            ? gameState.announcement.messageEn || gameState.announcement.message || gameState.announcement.messageVi
            : gameState.announcement.messageVi || gameState.announcement.message || gameState.announcement.messageEn;

        return (
          <div
            className={`max-w-3xl mx-auto w-full mt-6 p-6 rounded-2xl border text-center shadow-sm ${
              gameState.announcement.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-900'
                : gameState.announcement.type === 'success'
                ? 'bg-neutral-900 border-neutral-900 text-white'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-widest block mb-1 opacity-80">
              {annTitle}
            </span>
            <div className="text-lg sm:text-xl font-bold leading-relaxed whitespace-pre-line">
              {annMessage}
            </div>
          </div>
        );
      })()}

      {/* Main Screen Content */}
      <div className="max-w-3xl mx-auto w-full my-auto py-8">
        {/* ==================================================== */}
        {/* STAGE 1: MEMORIZE (15s) */}
        {/* ==================================================== */}
        {gameState.stage === 'MEMORIZE' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.readSecretWordTime}
            </span>
            <div className="text-7xl sm:text-8xl font-black font-mono my-6 text-neutral-900">
              {countdown}s
            </div>
            <p className="text-base sm:text-lg text-neutral-600 max-w-md mx-auto mb-8">
              {t.memorizeNoticeHost}
            </p>
            <button
              onClick={onNextTurn}
              className="py-3 px-6 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition text-sm cursor-pointer"
            >
              {t.skipCountdown}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 2: DESCRIBE (Turn-based) */}
        {/* ==================================================== */}
        {gameState.stage === 'DESCRIBE' && currentSpeaker && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.speakingTurn} ({gameState.currentTurnIndex + 1}/{gameState.turnOrder.length})
            </span>

            <div className="my-8">
              <span className="text-sm text-neutral-500 block mb-2">{t.speakerTurnOf}</span>
              <div className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
                {currentSpeaker.name}
              </div>
            </div>

            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
              {t.describeGuideHost}
            </p>

            <div className="flex justify-center gap-4">
              {isLastTurn ? (
                <button
                  onClick={onStartVoting}
                  className="py-4 px-8 bg-black text-white text-lg font-semibold rounded-xl hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer shadow-sm"
                >
                  {t.finishRoundAndVote}
                </button>
              ) : (
                <button
                  onClick={onNextTurn}
                  className="py-4 px-8 bg-black text-white text-lg font-semibold rounded-xl hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer shadow-sm"
                >
                  {t.nextPlayer}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 3: VOTE */}
        {/* ==================================================== */}
        {gameState.stage === 'VOTE' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.eliminationVote}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">{t.whoIsSpy}</h2>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
              {t.voteGuideHost}
            </p>

            {/* Voting Status List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-left">
              {alivePlayers.map((p) => {
                const hasVoted = Boolean(gameState.votes[p.id]);
                return (
                  <div
                    key={p.id}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between"
                  >
                    <span className="font-semibold text-neutral-800 truncate text-sm">{p.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          hasVoted
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {hasVoted ? t.votedBadge : t.waitingBadge}
                      </span>
                      {onKickPlayer && (
                        <button
                          type="button"
                          onClick={() => {
                            const confirmMsg = t.kickConfirm.replace('{name}', p.name);
                            if (window.confirm(confirmMsg)) {
                              onKickPlayer(p.id);
                            }
                          }}
                          title={t.kickPlayer}
                          className="text-neutral-300 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition cursor-pointer"
                        >
                          <UserX size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-neutral-400 mb-6">
              {t.votesReceived
                .replace('{current}', String(totalVotesReceived))
                .replace('{total}', String(alivePlayers.length))}
            </div>

            <button
              onClick={onRevealResult}
              disabled={!allAlivePlayersVoted}
              className="py-4 px-8 bg-black text-white text-lg font-semibold rounded-xl hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.revealVoteResult}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 4: RESULT */}
        {/* ==================================================== */}
        {gameState.stage === 'RESULT' && gameState.eliminatedId && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.resultStage}
            </span>

            {(() => {
              const eliminatedPlayer = gameState.playerRoles[gameState.eliminatedId];
              const wasSpy = eliminatedPlayer.role === 'SPY';

              return (
                <div className="my-6">
                  <div className="text-sm text-neutral-500 mb-2">
                    {t.eliminatedAnnouncement}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-neutral-900 mb-6">
                    {eliminatedPlayer.name}
                  </div>

                  {wasSpy ? (
                    <div className="p-6 bg-neutral-900 text-white rounded-2xl max-w-md mx-auto mb-8">
                      <div className="text-xl font-bold mb-1">{t.correctSpyTitle}</div>
                      <p className="text-sm text-neutral-300">
                        <strong>{eliminatedPlayer.name}</strong> {t.correctSpyHostSub}
                      </p>
                    </div>
                  ) : gameState.winner === 'SPY' ? (
                    <div className="p-6 bg-neutral-900 text-white rounded-2xl max-w-md mx-auto mb-8">
                      <div className="text-xl font-bold mb-1">{t.innocentTitle}</div>
                      <p className="text-sm text-neutral-300">
                        <strong>{eliminatedPlayer.name}</strong> {t.innocentSpyWinsHostSub}
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-2xl max-w-md mx-auto mb-8">
                      <div className="text-xl font-bold mb-1">{t.innocentTitle}</div>
                      <p className="text-sm text-neutral-600">
                        <strong>{eliminatedPlayer.name}</strong> {t.innocentHostSub}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={onNextRound}
                      className="py-4 px-8 bg-black text-white text-lg font-semibold rounded-xl hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer shadow-sm"
                    >
                      {gameState.winner ? t.viewGameOverBtn : t.nextRoundBtn}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 5: GAME_OVER */}
        {/* ==================================================== */}
        {gameState.stage === 'GAME_OVER' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.gameOverStage}
            </span>

            <div className="my-6">
              <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 mb-4 tracking-tight">
                {gameState.winner === 'CIVILIANS' ? t.civiliansWin : t.spyWins}
              </h2>
              <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
                {gameState.winner === 'CIVILIANS' ? t.civiliansWinDesc : t.spyWinsDesc}
              </p>

              {/* Reveal Words (Bilingual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left mb-8">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">{t.civilianWordReveal}</span>
                  <span className="text-lg font-bold text-neutral-900 block">{gameState.wordCivilian}</span>
                  <span className="text-xs text-neutral-500 font-medium">({gameState.wordCivilianEn})</span>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">
                    {t.spyWordReveal.replace('{name}', gameState.playerRoles[gameState.spyId]?.name || '')}
                  </span>
                  <span className="text-lg font-bold text-neutral-900 block">{gameState.wordSpy}</span>
                  <span className="text-xs text-neutral-500 font-medium">({gameState.wordSpyEn})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onPlayAgain}
                  className="py-3.5 px-6 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer shadow-sm text-base"
                >
                  {t.playAgain}
                </button>
                <button
                  onClick={onExitGame}
                  className="py-3.5 px-6 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-xl hover:bg-neutral-100 transition active:scale-[0.99] cursor-pointer text-base"
                >
                  {t.backToSelectGame}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <Footer
        label={`${t.game1Title} • Circus Cyber Party`}
        className="max-w-4xl mx-auto w-full"
      />

      {/* Players List & Kick Management Modal */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-neutral-700" />
                <h3 className="font-bold text-lg text-neutral-900">
                  {t.playerListModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowPlayersModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-[340px] overflow-y-auto">
              {Object.values(gameState.playerRoles).map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    role.isAlive
                      ? 'bg-neutral-50 border-neutral-200'
                      : 'bg-neutral-100/60 border-neutral-200/60 opacity-60'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-neutral-900 block truncate">{role.name}</span>
                    <span className="text-xs text-neutral-500">
                      {role.isAlive ? `● ${t.statusAlive}` : `✕ ${t.statusEliminated}`}
                    </span>
                  </div>
                  {onKickPlayer && (
                    <button
                      type="button"
                      onClick={() => {
                        const confirmMsg = t.kickConfirm.replace('{name}', role.name);
                        if (window.confirm(confirmMsg)) {
                          onKickPlayer(role.id);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 font-medium shrink-0"
                    >
                      <UserX size={16} />
                      <span>{t.kickPlayer}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 text-right">
              <button
                onClick={() => setShowPlayersModal(false)}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
