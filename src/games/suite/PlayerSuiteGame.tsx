import React, { useRef, useState } from 'react';
import type { Language } from '../../utils/i18n';
import { LanguageToggle } from '../../components/LanguageToggle';
import type { Point, SuiteAction, SuiteClientState } from './types';

const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = p => (
  <button {...p} className={`party-primary rounded-xl px-4 py-3 font-bold disabled:opacity-40 ${p.className || ''}`} />
);

const Card = ({ children }: { children: React.ReactNode }) => <section className="party-glass rounded-3xl p-5">{children}</section>;

const titleOf = (id: string, vi: boolean) =>
  ({
    'fake-artist': vi ? 'Họa Sĩ Giả Mạo' : 'A Fake Artist',
    codenames: 'Codenames',
    'most-likely': vi ? 'Ai Có Khả Năng Nhất?' : 'Most Likely To',
    'just-one': vi ? 'Chỉ Một Từ' : 'Just One',
    'the-mind': vi ? 'Đồng Điệu' : 'The Mind',
  }[id]);

export function PlayerSuiteGame({
  state,
  lang,
  onToggleLang,
  onAction,
  onChangeName,
}: {
  state: SuiteClientState;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onAction: (a: SuiteAction) => void;
  onChangeName?: (newName: string) => void;
}) {
  if (lang === 'en' && state.secret?.topicEn) state = { ...state, secret: { ...state.secret, topic: state.secret.topicEn } };
  const g = state.game,
    vi = lang === 'vi',
    [text, setText] = useState(''),
    [count, setCount] = useState(1),
    [points, setPoints] = useState<Point[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [confirmEndTurn, setConfirmEndTurn] = useState<boolean>(false);
  const drawing = useRef(false);
  const me = state.playerId,
    sentVote = 'votes' in g && Boolean(g.votes[me]);
  const name = (id: string) => g.players.find(p => p.id === id)?.name || '—';
  const point = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  return (
    <main className="party-shell min-h-screen p-4 text-white">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="party-kicker">MOBILE CONTROLLER</p>
            <span className="text-xs font-bold text-slate-300">({name(me)})</span>
            {onChangeName && (
              <button
                type="button"
                onClick={() => {
                  const current = name(me);
                  const newName = window.prompt(vi ? 'Nhập tên mới của bạn (tối đa 15 ký tự):' : 'Enter your new name (max 15 chars):', current);
                  if (newName && newName.trim() && newName.trim() !== current) {
                    onChangeName(newName.trim().slice(0, 15));
                  }
                }}
                className="text-[10px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
              >
                {vi ? 'Đổi tên' : 'Edit'}
              </button>
            )}
          </div>
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
        </div>
        <h1 className="text-3xl font-black mb-5">{titleOf(g.gameId, vi)}</h1>

        {g.gameId === 'fake-artist' && (
          <Card>
            <div className="text-center mb-4">
              <p className="text-slate-400">{vi ? 'Vai của bạn' : 'Your role'}</p>
              <h2 className="text-3xl font-black">
                {state.secret?.role === 'FAKE' ? (vi ? 'KẺ GIẢ MẠO' : 'FAKE ARTIST') : vi ? 'HỌA SĨ' : 'ARTIST'}
              </h2>
              {state.secret?.topic && (
                <p className="text-xl mt-2">
                  {vi ? 'Chủ đề' : 'Topic'}: <b>{state.secret.topic}</b>
                </p>
              )}
            </div>
            <p className="text-center text-sm text-slate-300 mb-3">
              {g.stage === 'DRAW' && g.turnOrder[g.turnIndex] === me
                ? vi
                  ? 'Bạn có một nét vẽ. Hãy vẽ tiếp trực tiếp trên tranh chung.'
                  : 'You have one stroke. Continue directly on the shared drawing.'
                : vi
                ? 'Tranh chung cập nhật sau mỗi nét vẽ'
                : 'The shared drawing updates after every stroke'}
            </p>
            <svg
              viewBox="0 0 400 280"
              className={`w-full bg-white rounded-2xl ${
                g.stage === 'DRAW' && g.turnOrder[g.turnIndex] === me ? 'touch-none ring-4 ring-fuchsia-400/60' : 'opacity-95'
              }`}
              onPointerDown={e => {
                if (g.stage !== 'DRAW' || g.turnOrder[g.turnIndex] !== me) return;
                drawing.current = true;
                setPoints([point(e)]);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={e => {
                if (!drawing.current) return;
                const nextPoint = point(e);
                setPoints(previous => [...previous, nextPoint].slice(0, 240));
              }}
              onPointerUp={() => {
                drawing.current = false;
                if (points.length > 1) {
                  onAction({ type: 'DRAW_STROKE', points });
                  setPoints([]);
                }
              }}
            >
              <rect width="400" height="280" fill="#fff" />
              {g.strokes.map((stroke, index) => (
                <polyline
                  key={index}
                  points={stroke.points.map(p => `${p.x * 400},${p.y * 280}`).join(' ')}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              <polyline
                points={points.map(p => `${p.x * 400},${p.y * 280}`).join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {g.stage === 'DRAW' && g.turnOrder[g.turnIndex] !== me ? (
              <p className="text-center mt-4">
                {vi ? 'Đợi lượt của' : 'Waiting for'} <b>{name(g.turnOrder[g.turnIndex])}</b>
              </p>
            ) : g.stage === 'VOTE' ? (
              <div className="mt-5">
                {g.tie && (
                  <p className="text-amber-400 font-bold text-center mb-3 text-sm animate-pulse">
                    ⚠️ {vi ? 'Số phiếu bị hòa! Vui lòng thảo luận và bỏ phiếu lại.' : 'Tie vote! Please discuss and revote.'}
                  </p>
                )}
                <Vote players={g.players} me={me} disabled={sentVote} onVote={id => onAction({ type: 'VOTE_PLAYER', targetId: id })} />
              </div>
            ) : g.stage === 'FAKE_GUESS' && state.secret?.role === 'FAKE' ? (
              <div className="mt-5">
                <TextSubmit
                  text={text}
                  setText={setText}
                  label={vi ? 'Đoán chủ đề' : 'Guess topic'}
                  onSubmit={() => {
                    if (!text.trim()) return;
                    onAction({ type: 'FAKE_GUESS', guess: text.trim() });
                    setText('');
                  }}
                />
              </div>
            ) : g.stage !== 'DRAW' ? (
              <p className="text-center text-xl mt-5">
                {g.stage === 'GAME_OVER'
                  ? g.winner === 'FAKE'
                    ? vi
                      ? 'Kẻ giả mạo thắng!'
                      : 'Fake artist wins!'
                    : vi
                    ? 'Nhóm họa sĩ thắng!'
                    : 'Artists win!'
                  : vi
                  ? 'Đang chờ Kẻ giả mạo đoán...'
                  : 'Waiting for the fake artist...'}
              </p>
            ) : null}
          </Card>
        )}

        {g.gameId === 'codenames' && (
          <Card>
            <p className="text-center mb-4">
              {vi ? 'Đội' : 'Team'} <b className={state.secret?.team === 'RED' ? 'text-red-400' : 'text-blue-400'}>{state.secret?.team}</b> •{' '}
              <b>{state.secret?.role === 'SPYMASTER' ? (vi ? 'Chỉ huy (Spymaster)' : 'Spymaster') : vi ? 'Điệp viên (Operative)' : 'Operative'}</b>
            </p>

            {/* Secret color key board for Spymaster */}
            {state.secret?.role === 'SPYMASTER' && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold uppercase tracking-wider">{vi ? 'Bản đồ mật mã (Chỉ bạn thấy)' : 'Secret Key (Only you see)'}</span>
                  <span className="text-[11px] text-amber-400/90 font-semibold">{vi ? '☠ = Sát thủ' : '☠ = Assassin'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                  {g.board.map((c, i) => {
                    const bg = c.revealed
                      ? 'bg-slate-900/60 opacity-30 line-through text-slate-500 border-white/5'
                      : c.role === 'RED'
                      ? 'bg-rose-500/25 border-rose-500/60 text-rose-300 font-bold'
                      : c.role === 'BLUE'
                      ? 'bg-sky-500/25 border-sky-500/60 text-sky-300 font-bold'
                      : c.role === 'ASSASSIN'
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 font-black'
                      : 'bg-white/5 border-white/10 text-slate-300';
                    return (
                      <div
                        key={i}
                        className={`min-h-12 p-1 text-[10px] leading-tight rounded-lg border flex flex-col items-center justify-center text-center select-none ${bg}`}
                      >
                        <span className="break-words line-clamp-2">{vi ? c.word : (c.wordEn || c.word)}</span>
                        {c.role === 'ASSASSIN' && !c.revealed && <span className="text-[9px] text-amber-400 font-bold">☠</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {g.stage === 'CLUE' && state.secret?.role === 'SPYMASTER' && g.currentTeam === state.secret.team ? (
              <>
                <p className="text-sm font-bold text-slate-300 mb-2">
                  {vi ? 'Nhập từ gợi ý cho đồng đội:' : 'Enter clue for your operatives:'}
                </p>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  maxLength={20}
                  placeholder={vi ? 'Một từ gợi ý' : 'One-word clue'}
                  className="w-full rounded-xl bg-black/30 border border-white/15 p-3 text-white"
                />
                <div className="flex gap-3 mt-3">
                  <div className="flex items-center gap-1.5 bg-black/30 border border-white/15 rounded-xl px-3">
                    <span className="text-xs text-slate-400">{vi ? 'Số từ' : 'Count'}:</span>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={count}
                      onChange={e => setCount(Number(e.target.value))}
                      className="w-12 bg-transparent p-2 text-center font-bold text-white outline-none"
                    />
                  </div>
                  <Btn
                    disabled={!text.trim()}
                    onClick={() => {
                      if (!text.trim()) return;
                      onAction({ type: 'GIVE_CLUE', clue: text.trim(), count });
                      setText('');
                    }}
                    className="flex-1"
                  >
                    {vi ? 'Gửi gợi ý' : 'Send clue'}
                  </Btn>
                </div>
              </>
            ) : g.stage === 'GUESS' && state.secret?.role === 'OPERATIVE' && g.currentTeam === state.secret.team ? (
              <>
                <div className="text-center mb-3">
                  <p className="text-2xl font-black text-amber-300">
                    "{g.clue}" — {g.guessesLeft} {vi ? 'lượt đoán' : 'guesses left'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    👥 {vi
                      ? 'Thảo luận trực tiếp cùng đồng đội trong phòng rồi thống nhất chọn thẻ!'
                      : 'Discuss with teammates in the room, agree, and tap the chosen card!'}
                  </p>
                </div>

                {/* Confirmation Box when an Operative taps a card */}
                {selectedCardIndex !== null && g.board[selectedCardIndex] && (
                  <div className="bg-amber-500/15 border border-amber-400/50 rounded-2xl p-3.5 my-3 text-center shadow-lg animate-pulse">
                    <p className="text-xs font-semibold text-amber-300">
                      {vi ? '🗣️ Cả đội đã thống nhất chọn từ này?' : '🗣️ Has the team agreed on this word?'}
                    </p>
                    <p className="text-xl font-black text-white mt-1">
                      "{vi ? g.board[selectedCardIndex].word : (g.board[selectedCardIndex].wordEn || g.board[selectedCardIndex].word)}"
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedCardIndex(null)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition"
                      >
                        {vi ? 'Hủy / Chọn lại' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => {
                          onAction({ type: 'GUESS_CARD', index: selectedCardIndex });
                          setSelectedCardIndex(null);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition"
                      >
                        {vi ? '✓ Xác nhận đoán' : '✓ Confirm Guess'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-1.5">
                  {g.board.map((c, i) => {
                    const isSelected = selectedCardIndex === i;
                    return (
                      <button
                        key={i}
                        disabled={c.revealed}
                        onClick={() => {
                          setSelectedCardIndex(i);
                          setConfirmEndTurn(false);
                        }}
                        className={`min-h-14 text-[10px] font-bold rounded-lg border p-1 transition flex items-center justify-center text-center break-words ${
                          c.revealed
                            ? 'bg-slate-800/60 opacity-40 text-slate-500 border-white/5 line-through'
                            : isSelected
                            ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md ring-2 ring-amber-300'
                            : 'bg-white/10 border-white/10 hover:border-cyan-400 hover:bg-white/15 active:scale-95 text-white'
                        }`}
                      >
                        {vi ? c.word : (c.wordEn || c.word)}
                      </button>
                    );
                  })}
                </div>

                {confirmEndTurn ? (
                  <div className="bg-rose-500/15 border border-rose-400/40 rounded-xl p-3 mt-4 text-center">
                    <p className="text-xs text-rose-200 font-semibold mb-2">
                      {vi ? 'Bạn chắc chắn muốn kết thúc lượt đoán sớm?' : 'End your team turn early?'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmEndTurn(false)}
                        className="flex-1 py-2 rounded-lg bg-white/10 text-xs font-bold"
                      >
                        {vi ? 'Tiếp tục đoán' : 'Keep guessing'}
                      </button>
                      <button
                        onClick={() => {
                          onAction({ type: 'END_TURN' });
                          setConfirmEndTurn(false);
                          setSelectedCardIndex(null);
                        }}
                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                      >
                        {vi ? 'Xác nhận kết thúc' : 'Confirm End'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <Btn onClick={() => setConfirmEndTurn(true)} className="w-full mt-4 party-secondary text-xs sm:text-sm">
                    {vi ? 'Kết thúc lượt đoán sớm' : 'End turn early'}
                  </Btn>
                )}
              </>
            ) : (
              <p className="text-center py-2 text-slate-300">
                {g.stage === 'GAME_OVER'
                  ? `${g.winner} ${vi ? 'chiến thắng!' : 'wins!'}`
                  : g.stage === 'GUESS' && state.secret?.role === 'SPYMASTER' && g.currentTeam === state.secret.team
                  ? vi
                    ? `Đồng đội đang đoán theo gợi ý "${g.clue}" (${g.guessesLeft} lượt)...`
                    : `Operatives guessing for clue "${g.clue}" (${g.guessesLeft} left)...`
                  : vi
                  ? 'Theo dõi màn hình Host'
                  : 'Watch the Host screen'}
              </p>
            )}
          </Card>
        )}

        {g.gameId === 'most-likely' && (
          <Card>
            <h2 className="text-2xl font-black text-center mb-6">{vi ? g.prompt : g.promptEn}</h2>
            {g.stage === 'VOTE' ? (
              <Vote players={g.players} me={me} disabled={sentVote} onVote={id => onAction({ type: 'VOTE_PLAYER', targetId: id })} />
            ) : (
              <p className="text-center text-xl">
                {g.stage === 'RESULT' ? (vi ? 'Kết quả đã lên màn hình Host!' : 'Results are on the Host screen!') : vi ? 'Đã kết thúc' : 'Game over'}
              </p>
            )}
          </Card>
        )}

        {g.gameId === 'just-one' && (
          <Card>
            {g.stage === 'CLUE' && me !== g.guesserId ? (
              g.clues[me] ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <p className="text-lg font-bold text-emerald-300">
                    {vi ? 'Đã gửi gợi ý thành công!' : 'Clue submitted!'}
                  </p>
                  <p className="text-2xl font-black mt-2 text-white">"{g.clues[me]}"</p>
                  <p className="text-xs text-slate-400 mt-4 animate-pulse">
                    {vi ? 'Đang chờ những người chơi khác gửi gợi ý...' : 'Waiting for other players...'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase font-bold text-slate-400 text-center mb-1">
                    {vi ? 'Từ khóa cần gợi ý' : 'Word to hint'}
                  </p>
                  <p className="text-center text-3xl font-black mb-5 text-cyan-300">{vi ? g.word : g.wordEn}</p>
                  <TextSubmit
                    text={text}
                    setText={setText}
                    label={vi ? 'Gửi đúng 1 từ' : 'Send exactly one word'}
                    onSubmit={() => {
                      if (!text.trim()) return;
                      onAction({ type: 'SUBMIT_CLUE', clue: text.trim() });
                      setText('');
                    }}
                  />
                </>
              )
            ) : g.stage === 'GUESS' && me === g.guesserId ? (
              <>
                <p className="text-xs uppercase font-bold text-slate-400 text-center mb-2">
                  {vi ? 'Các gợi ý của đồng đội' : 'Surviving clues from team'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                  {g.validClues.map((c, i) => (
                    <span key={i} className="party-chip px-4 py-2 rounded-xl text-xl font-bold">
                      {c}
                    </span>
                  ))}
                </div>
                <TextSubmit
                  text={text}
                  setText={setText}
                  label={vi ? 'Chốt đáp án' : 'Submit answer'}
                  onSubmit={() => {
                    if (!text.trim()) return;
                    onAction({ type: 'SUBMIT_ANSWER', answer: text.trim() });
                    setText('');
                  }}
                />
                <button
                  className="w-full mt-3 text-slate-400 hover:text-white transition py-2"
                  onClick={() => {
                    onAction({ type: 'SKIP_ANSWER' });
                    setText('');
                  }}
                >
                  {vi ? 'Bỏ qua' : 'Skip'}
                </button>
              </>
            ) : (
              <p className="text-center text-xl">
                {g.stage === 'CLUE' && me === g.guesserId
                  ? vi
                    ? 'Bạn là Người Đoán. Đừng nhìn màn hình Host!'
                    : 'You are the Guesser. Do not look at the Host!'
                  : vi
                  ? 'Theo dõi màn hình Host'
                  : 'Watch the Host screen'}
              </p>
            )}
          </Card>
        )}

        {g.gameId === 'the-mind' && (
          <Card>
            <div className="text-center mb-5">
              <p>
                {vi ? 'Cấp' : 'Level'} {g.level} • {'❤️'.repeat(g.lives)}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                {vi
                  ? 'Không nói. Không ra hiệu. Chạm lá thấp nhất khi bạn cảm thấy đúng lúc.'
                  : 'No talking. No signals. Play your lowest card when it feels right.'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(state.secret?.hand || []).map(card => (
                <button
                  key={card}
                  disabled={g.stage !== 'PLAY'}
                  onClick={() => onAction({ type: 'PLAY_CARD', card })}
                  className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-3xl font-black shadow-lg disabled:opacity-40 hover:scale-105 active:scale-95 transition"
                >
                  {card}
                </button>
              ))}
            </div>
            {state.secret?.hand?.length === 0 && (
              <p className="text-center mt-4 text-emerald-400 font-bold">
                {vi ? 'Bạn đã hết bài. Giữ im lặng!' : 'Your hand is empty. Stay silent!'}
              </p>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}

function Vote({
  players,
  me,
  disabled,
  onVote,
}: {
  players: { id: string; name: string }[];
  me: string;
  disabled: boolean;
  onVote: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {players
        .filter(p => p.id !== me)
        .map(p => (
          <button
            key={p.id}
            disabled={disabled}
            onClick={() => onVote(p.id)}
            className="party-secondary rounded-xl p-3 font-bold disabled:opacity-40"
          >
            {p.name}
          </button>
        ))}
    </div>
  );
}

function TextSubmit({
  text,
  setText,
  label,
  onSubmit,
}: {
  text: string;
  setText: (v: string) => void;
  label: string;
  onSubmit: () => void;
}) {
  return (
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={40}
        autoComplete="off"
        spellCheck={false}
        data-form-type="other"
        className="w-full rounded-xl bg-black/30 border border-white/15 p-3 text-white"
      />
      <Btn disabled={!text.trim()} onClick={onSubmit} className="w-full mt-3">
        {label}
      </Btn>
    </div>
  );
}
