import React, { useRef, useEffect } from 'react';
import { Language } from '../../utils/i18n';
import { LanguageToggle } from '../../components/LanguageToggle';
import { HostAudioToggle } from '../../components/HostAudioToggle';
import { playHostSound } from '../../utils/sound';
import type { SuiteGameState } from './types';

const nameOf = (s: SuiteGameState, id: string | null) => s.players.find(p => p.id === id)?.name || '—';

const Shell: React.FC<React.PropsWithChildren<{
  title: string;
  subtitle: string;
  onExit: () => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
}>> = ({ title, subtitle, onExit, children, lang, onToggleLang }) => (
  <main className="party-shell min-h-screen p-4 sm:p-8 text-white">
    <div className="max-w-6xl mx-auto">
      <header className="party-glass rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="party-kicker">LIVE GAME</p>
          <h1 className="text-2xl sm:text-4xl font-black">{title}</h1>
          <p className="text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <HostAudioToggle />
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
          <button className="party-secondary px-4 py-2 rounded-xl" onClick={onExit}>
            {lang === 'vi' ? 'Về sảnh' : 'Lobby'}
          </button>
        </div>
      </header>
      {children}
    </div>
  </main>
);

const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = p => (
  <button {...p} className={`party-primary rounded-xl px-5 py-3 font-bold disabled:opacity-40 ${p.className || ''}`} />
);

export function HostSuiteGame({
  state,
  lang,
  onToggleLang,
  onNext,
  onReplay,
  onExit,
}: {
  state: SuiteGameState;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onNext: () => void;
  onReplay: () => void;
  onExit: () => void;
}) {
  const prevStateRef = useRef<SuiteGameState>(state);

  useEffect(() => {
    const prev = prevStateRef.current;
    if (prev.gameId !== state.gameId) {
      playHostSound('start');
    } else if (state.gameId === 'codenames' && prev.gameId === 'codenames') {
      if (prev.stage === 'CLUE' && state.stage === 'GUESS') {
        playHostSound('clue');
      }
      const prevRevealed = prev.board.filter(c => c.revealed).length;
      const currRevealed = state.board.filter(c => c.revealed).length;
      if (currRevealed > prevRevealed) {
        const newCard = state.board.find((c, i) => c.revealed && !prev.board[i]?.revealed);
        if (newCard) {
          if (newCard.role === 'ASSASSIN') {
            playHostSound('assassin');
          } else if (newCard.role === prev.currentTeam) {
            playHostSound('correct');
          } else {
            playHostSound('wrong');
          }
        }
      }
      if (prev.stage !== 'GAME_OVER' && state.stage === 'GAME_OVER') {
        playHostSound('cheer');
      }
    } else if (state.gameId === 'fake-artist' && prev.gameId === 'fake-artist') {
      if (state.strokes.length > prev.strokes.length) {
        playHostSound('pop');
      }
      if (state.tie && !prev.tie) {
        playHostSound('wrong');
      }
      if (prev.stage !== 'GAME_OVER' && state.stage === 'GAME_OVER') {
        playHostSound('cheer');
      }
    } else if (state.gameId === 'most-likely' && prev.gameId === 'most-likely') {
      if (state.round !== prev.round) {
        playHostSound('turn');
      }
      if (prev.stage !== 'RESULT' && state.stage === 'RESULT') {
        playHostSound('cheer');
      }
      if (prev.stage !== 'GAME_OVER' && state.stage === 'GAME_OVER') {
        playHostSound('cheer');
      }
    } else if (state.gameId === 'just-one' && prev.gameId === 'just-one') {
      if (prev.stage === 'CLUE' && state.stage === 'GUESS') {
        playHostSound('reveal');
      }
      if (prev.stage !== 'RESULT' && state.stage === 'RESULT') {
        if (state.success) playHostSound('correct');
        else playHostSound('wrong');
      }
      if (prev.stage !== 'GAME_OVER' && state.stage === 'GAME_OVER') {
        playHostSound('cheer');
      }
    } else if (state.gameId === 'the-mind' && prev.gameId === 'the-mind') {
      if (state.pile.length > prev.pile.length) {
        playHostSound('pop');
      }
      if (state.lives < prev.lives) {
        playHostSound('wrong');
      }
      if (prev.stage !== 'LEVEL_RESULT' && state.stage === 'LEVEL_RESULT') {
        playHostSound('correct');
      }
      if (prev.stage !== 'GAME_OVER' && state.stage === 'GAME_OVER') {
        if (state.won) playHostSound('cheer');
        else playHostSound('wrong');
      }
    }
    prevStateRef.current = state;
  }, [state]);

  if (state.gameId === 'fake-artist')
    return (
      <Shell
        title={lang === 'vi' ? 'Họa Sĩ Giả Mạo' : 'A Fake Artist'}
        subtitle={
          state.stage === 'DRAW'
            ? `${lang === 'vi' ? 'Vòng' : 'Round'} ${state.round}/2 • ${lang === 'vi' ? 'Lượt của' : 'Turn'} ${nameOf(state, state.turnOrder[state.turnIndex])}`
            : state.stage === 'VOTE'
            ? state.tie
              ? (lang === 'vi' ? 'Hòa phiếu! Đang bỏ phiếu lại' : 'Tie vote! Revoting')
              : (lang === 'vi' ? 'Cả phòng đang bỏ phiếu' : 'Voting in progress')
            : state.stage === 'FAKE_GUESS'
            ? (lang === 'vi' ? 'Kẻ giả mạo đang đoán chủ đề' : 'The fake artist is guessing')
            : state.winner === 'FAKE'
            ? (lang === 'vi' ? 'Kẻ giả mạo thắng!' : 'Fake artist wins!')
            : (lang === 'vi' ? 'Nhóm họa sĩ thắng!' : 'Artists win!')
        }
        onExit={onExit}
        lang={lang}
        onToggleLang={onToggleLang}
      >
        <section className="party-glass rounded-3xl p-4">
          <svg viewBox="0 0 800 500" className="w-full bg-white rounded-2xl shadow-2xl">
            <rect width="800" height="500" fill="#fff" />
            {state.strokes.map((s, i) => (
              <polyline
                key={i}
                points={s.points.map(p => `${p.x * 800},${p.y * 500}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
          {state.stage === 'VOTE' && state.tie && (
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3 text-center my-4 text-amber-300 font-bold animate-pulse">
              ⚠️ {lang === 'vi' ? 'Số phiếu bị hòa! Cả phòng hãy thảo luận và bỏ phiếu lại.' : 'Tie vote! Please discuss and revote.'}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {state.players.map((p, i) => (
              <span
                key={p.id}
                className="party-chip px-3 py-1 rounded-full text-sm"
                style={{ borderColor: ['#fb7185', '#38bdf8', '#34d399', '#fbbf24', '#a78bfa'][i % 5] }}
              >
                {p.name}
              </span>
            ))}
          </div>
          {state.stage === 'GAME_OVER' && (
            <div className="text-center mt-6">
              <p className="text-xl">
                {lang === 'vi' ? 'Chủ đề' : 'Topic'}: <b>{lang === 'vi' ? state.topic : state.topicEn}</b> • Fake: <b>{nameOf(state, state.fakeId)}</b>
              </p>
              <Btn onClick={onReplay} className="mt-4">
                {lang === 'vi' ? 'Chơi lại' : 'Play again'}
              </Btn>
            </div>
          )}
        </section>
      </Shell>
    );

  if (state.gameId === 'codenames')
    return (
      <Shell
        title="Codenames"
        subtitle={
          state.stage === 'GAME_OVER'
            ? `${state.winner} ${lang === 'vi' ? 'chiến thắng!' : 'wins!'}`
            : `${lang === 'vi' ? 'Lượt đội' : 'Team'} ${state.currentTeam} • ${state.stage === 'CLUE' ? (lang === 'vi' ? 'Chờ Chỉ huy ra gợi ý' : 'Waiting for clue') : `"${state.clue}" — ${state.guessesLeft} ${lang === 'vi' ? 'lượt đoán' : 'guesses left'}`}`
        }
        onExit={onExit}
        lang={lang}
        onToggleLang={onToggleLang}
      >
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {state.board.map((c, i) => (
            <div
              key={i}
              className={`min-h-16 sm:min-h-24 rounded-xl grid place-items-center text-center p-1 sm:p-3 font-black text-[10px] sm:text-base border transition ${
                c.revealed
                  ? c.role === 'RED'
                    ? 'bg-red-600 border-red-300 shadow-md shadow-red-500/30'
                    : c.role === 'BLUE'
                    ? 'bg-blue-600 border-blue-300 shadow-md shadow-blue-500/30'
                    : c.role === 'ASSASSIN'
                    ? 'bg-black border-white text-red-400 font-mono shadow-lg shadow-black'
                    : 'bg-amber-100 text-slate-900 border-amber-300'
                  : 'bg-slate-800 border-white/10'
              }`}
            >
              {lang === 'vi' ? c.word : (c.wordEn || c.word)}
            </div>
          ))}
        </div>

        {/* Live status banner guiding players */}
        {state.stage === 'GUESS' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 border border-amber-400/40 text-center animate-pulse shadow-lg">
            <span className="font-black text-amber-300 text-base sm:text-lg">
              🎯 {lang === 'vi' ? `Lượt Đội ${state.currentTeam === 'RED' ? 'ĐỎ' : 'XANH'}` : `Team ${state.currentTeam}'s Turn`}:
            </span>{' '}
            <span className="font-bold text-white text-base">
              "{state.clue}" ({state.guessesLeft} {lang === 'vi' ? 'lượt đoán' : 'guesses left'})
            </span>
            <p className="text-xs text-slate-300 mt-1">
              🗣️ {lang === 'vi'
                ? 'Các điệp viên trong đội hãy cùng thảo luận trực tiếp và cử một người bấm chọn thẻ trên điện thoại!'
                : 'Team operatives discuss together, then have one member tap the chosen card on their phone!'}
            </p>
          </div>
        )}

        {/* Detailed Team Roster Cards */}
        <div className="party-glass rounded-2xl p-4 mt-5 grid sm:grid-cols-2 gap-4">
          <div
            className={`rounded-xl p-3.5 border transition ${
              state.currentTeam === 'RED' && state.stage !== 'GAME_OVER'
                ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-950/40'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                🔴 {lang === 'vi' ? 'ĐỘI ĐỎ' : 'RED TEAM'} ({state.players.filter(p => state.teams[p.id] === 'RED').length})
              </span>
              <span className="text-xs bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                {state.board.filter(c => c.role === 'RED' && !c.revealed).length} {lang === 'vi' ? 'thẻ còn lại' : 'left'}
              </span>
            </div>
            <p className="text-sm">
              <span className="text-slate-400">{lang === 'vi' ? 'Chỉ huy' : 'Spymaster'}:</span> <b>{nameOf(state, state.spymasters.RED)}</b>
            </p>
            <p className="text-xs text-slate-300 mt-1">
              <span className="text-slate-400">{lang === 'vi' ? 'Điệp viên' : 'Operatives'}:</span>{' '}
              {state.players
                .filter(p => state.teams[p.id] === 'RED' && p.id !== state.spymasters.RED)
                .map(p => p.name)
                .join(', ') || '—'}
            </p>
          </div>

          <div
            className={`rounded-xl p-3.5 border transition ${
              state.currentTeam === 'BLUE' && state.stage !== 'GAME_OVER'
                ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-950/40'
                : 'bg-sky-950/20 border-sky-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sky-400 text-sm flex items-center gap-1.5">
                🔵 {lang === 'vi' ? 'ĐỘI XANH' : 'BLUE TEAM'} ({state.players.filter(p => state.teams[p.id] === 'BLUE').length})
              </span>
              <span className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full font-bold">
                {state.board.filter(c => c.role === 'BLUE' && !c.revealed).length} {lang === 'vi' ? 'thẻ còn lại' : 'left'}
              </span>
            </div>
            <p className="text-sm">
              <span className="text-slate-400">{lang === 'vi' ? 'Chỉ huy' : 'Spymaster'}:</span> <b>{nameOf(state, state.spymasters.BLUE)}</b>
            </p>
            <p className="text-xs text-slate-300 mt-1">
              <span className="text-slate-400">{lang === 'vi' ? 'Điệp viên' : 'Operatives'}:</span>{' '}
              {state.players
                .filter(p => state.teams[p.id] === 'BLUE' && p.id !== state.spymasters.BLUE)
                .map(p => p.name)
                .join(', ') || '—'}
            </p>
          </div>
        </div>

        {state.stage === 'GAME_OVER' && (
          <div className="text-center mt-5">
            <Btn onClick={onReplay}>{lang === 'vi' ? 'Chơi lại' : 'Play again'}</Btn>
          </div>
        )}
      </Shell>
    );

  if (state.gameId === 'most-likely')
    return (
      <Shell
        title={lang === 'vi' ? 'Ai Có Khả Năng Nhất?' : 'Most Likely To'}
        subtitle={`${lang === 'vi' ? 'Câu' : 'Question'} ${state.round}/${state.questions?.length || 20}`}
        onExit={onExit}
        lang={lang}
        onToggleLang={onToggleLang}
      >
        <section className="party-glass rounded-3xl p-6 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-6xl font-black leading-tight">{lang === 'vi' ? state.prompt : state.promptEn}</h2>
          {state.stage === 'VOTE' && (
            <p className="text-slate-400 mt-6">
              {Object.keys(state.votes).length}/{state.players.length} {lang === 'vi' ? 'đã bình chọn' : 'voted'}
            </p>
          )}
          {state.stage === 'RESULT' && (
            <>
              <p className="text-xl mt-8 text-pink-300">{lang === 'vi' ? 'Được gọi tên nhiều nhất' : 'Most votes'}</p>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {state.winners.map(id => (
                  <span className="party-chip rounded-full px-5 py-2 text-xl font-black" key={id}>
                    {nameOf(state, id)}
                  </span>
                ))}
              </div>
              <Btn onClick={onNext} className="mt-8">
                {lang === 'vi' ? 'Câu tiếp theo' : 'Next question'}
              </Btn>
            </>
          )}
          {state.stage === 'GAME_OVER' && (
            <Btn onClick={onReplay} className="mt-8">
              {lang === 'vi' ? 'Chơi lại' : 'Play again'}
            </Btn>
          )}
        </section>
      </Shell>
    );

  if (state.gameId === 'just-one')
    return (
      <Shell
        title={lang === 'vi' ? 'Chỉ Một Từ' : 'Just One'}
        subtitle={`${lang === 'vi' ? 'Vòng' : 'Round'} ${state.round}/${state.players.length} • ${lang === 'vi' ? 'Người đoán' : 'Guesser'}: ${nameOf(state, state.guesserId)}`}
        onExit={onExit}
        lang={lang}
        onToggleLang={onToggleLang}
      >
        <section className="party-glass rounded-3xl p-6 sm:p-10 text-center">
          {state.stage === 'CLUE' && (
            <>
              <p className="text-amber-300 font-bold uppercase tracking-wider text-sm">
                {lang === 'vi' ? 'Đang viết gợi ý bí mật' : 'Writing secret clues'}
              </p>
              <div className="text-5xl sm:text-6xl font-black mt-3 text-cyan-300/40 tracking-[0.25em] select-none">
                ✦ ✦ ✦ ✦
              </div>
              <p className="text-slate-400 text-sm mt-3">
                {lang === 'vi'
                  ? `Người đoán (${nameOf(state, state.guesserId)}) không nhìn màn hình!`
                  : `Guesser (${nameOf(state, state.guesserId)}) please look away!`}
              </p>
              <p className="party-chip inline-block px-4 py-2 rounded-xl mt-6 font-bold text-cyan-300">
                {Object.keys(state.clues).length}/{state.players.length - 1} {lang === 'vi' ? 'người đã gửi gợi ý' : 'clues submitted'}
              </p>
            </>
          )}
          {state.stage === 'GUESS' && (
            <>
              <p className="text-slate-400">{lang === 'vi' ? 'Gợi ý sống sót' : 'Surviving clues'}</p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {state.validClues.map((c, i) => (
                  <span key={i} className="party-chip rounded-xl px-5 py-3 text-xl font-bold">
                    {c}
                  </span>
                ))}
              </div>
              {state.duplicateClues.length > 0 && (
                <p className="text-rose-300 mt-5">
                  {lang === 'vi' ? 'Bị triệt tiêu' : 'Cancelled'}: <s>{state.duplicateClues.join(', ')}</s>
                </p>
              )}
            </>
          )}
          {state.stage === 'RESULT' && (
            <>
              <p className="text-5xl">{state.success ? '🎉' : '💥'}</p>
              <h2 className="text-3xl font-black mt-3">
                {state.success ? (lang === 'vi' ? 'Chính xác!' : 'Correct!') : lang === 'vi' ? 'Chưa đúng!' : 'Not quite!'}
              </h2>
              <p className="mt-3">
                {lang === 'vi' ? 'Đáp án' : 'Answer'}: <b>{lang === 'vi' ? state.word : state.wordEn}</b> • {lang === 'vi' ? 'Điểm' : 'Score'}: {state.score}
              </p>
              <Btn onClick={onNext} className="mt-7">
                {lang === 'vi' ? 'Vòng tiếp' : 'Next round'}
              </Btn>
            </>
          )}
          {state.stage === 'GAME_OVER' && (
            <>
              <h2 className="text-4xl font-black">
                {lang === 'vi' ? 'Tổng điểm' : 'Final score'}: {state.score}/{state.players.length}
              </h2>
              <Btn onClick={onReplay} className="mt-7">
                {lang === 'vi' ? 'Chơi lại' : 'Play again'}
              </Btn>
            </>
          )}
        </section>
      </Shell>
    );

  return (
    <Shell
      title={lang === 'vi' ? 'Đồng Điệu' : 'The Mind'}
      subtitle={`${lang === 'vi' ? 'Cấp' : 'Level'} ${state.level}/6 • ${'❤️'.repeat(state.lives)}`}
      onExit={onExit}
      lang={lang}
      onToggleLang={onToggleLang}
    >
      <section className="party-glass rounded-3xl p-6 text-center">
        <div className="text-8xl font-black my-12">{state.pile.at(-1) ?? '—'}</div>
        <p className="text-slate-400">
          {lang === 'vi' ? 'Lá gần nhất' : 'Latest card'} {state.lastPlayedBy ? `• ${nameOf(state, state.lastPlayedBy)}` : ''}
        </p>
        {state.lostCards.length > 0 && (
          <p className="text-rose-300 mt-4">
            {lang === 'vi' ? 'Bỏ lỡ' : 'Missed'}: {state.lostCards.join(', ')}
          </p>
        )}
        {state.stage === 'LEVEL_RESULT' && (
          <>
            <h2 className="text-3xl font-black mt-8">✨ {lang === 'vi' ? 'Hoàn thành cấp!' : 'Level clear!'}</h2>
            <Btn onClick={onNext} className="mt-5">
              {lang === 'vi' ? 'Cấp tiếp theo' : 'Next level'}
            </Btn>
          </>
        )}
        {state.stage === 'GAME_OVER' && (
          <>
            <h2 className="text-3xl font-black mt-8">{state.won ? '🏆 Đồng điệu tuyệt đối!' : '💔 Hết mạng!'}</h2>
            <Btn onClick={onReplay} className="mt-5">
              {lang === 'vi' ? 'Chơi lại' : 'Play again'}
            </Btn>
          </>
        )}
      </section>
    </Shell>
  );
}
