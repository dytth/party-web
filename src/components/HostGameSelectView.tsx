import React from 'react';
import { Player } from '../types';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import { HostAudioToggle } from './HostAudioToggle';
import { Footer } from './Footer';
import { Grid3X3, Lightbulb, Palette, Sparkles, VenetianMask, Vote, Waves, type LucideIcon } from 'lucide-react';
import { playHostSound } from '../utils/sound';

interface GameCard {
  id: string;
  title: string;
  titleEn: string;
  genre: string;
  genreEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  color: string;
  icon: LucideIcon;
  ready?: boolean;
}

const GAMES: GameCard[] = [
  { id: 'the-lost-spy', title: 'Điệp Viên Lạc Lối', titleEn: 'Who is the Spy', genre: 'Ẩn vai • Suy luận', genreEn: 'Deduction • Hidden role', description: 'Miêu tả khéo léo, đọc vị cả phòng và tìm ra người đang lệch sóng.', descriptionEn: 'Give clever clues, read the room, and expose the player who is out of sync.', duration: '15–25 min', color: '#a855f7', icon: VenetianMask, ready: true },
  { id: 'fake-artist', title: 'Họa Sĩ Giả Mạo', titleEn: 'A Fake Artist', genre: 'Vẽ hình • Ẩn vai', genreEn: 'Drawing • Hidden role', description: 'Mỗi người vẽ một nét. Kẻ giả mạo phải hòa nhập dù không biết chủ đề.', descriptionEn: 'Draw one line at a time while the fake artist tries to blend in.', duration: '15–20 min', color: '#f472b6', icon: Palette, ready: true },
  { id: 'codenames', title: 'Mật Danh', titleEn: 'Codenames', genre: 'Từ vựng • Chia đội', genreEn: 'Words • Teams', description: 'Dùng một từ gợi ý để dẫn đồng đội qua ma trận mật danh 5×5.', descriptionEn: 'Guide your team across a 5×5 codename grid with one-word clues.', duration: '20–30 min', color: '#38bdf8', icon: Grid3X3, ready: true },
  { id: 'most-likely', title: 'Ai Có Khả Năng Nhất?', titleEn: 'Most Likely To', genre: 'Bình chọn • Party', genreEn: 'Voting • Party', description: 'Bí mật bình chọn, công bố kết quả và xem ai bị cả phòng gọi tên.', descriptionEn: 'Vote in secret and reveal who the whole room chose.', duration: '10–20 min', color: '#fb7185', icon: Vote, ready: true },
  { id: 'just-one', title: 'Chỉ Một Từ', titleEn: 'Just One', genre: 'Đoán chữ • Hợp tác', genreEn: 'Words • Co-op', description: 'Viết gợi ý độc nhất — gợi ý trùng nhau sẽ bị triệt tiêu.', descriptionEn: 'Write a unique clue; duplicate clues disappear.', duration: '15–25 min', color: '#2dd4bf', icon: Lightbulb, ready: true },
  { id: 'the-mind', title: 'Đồng Điệu', titleEn: 'The Mind', genre: 'Phản xạ • Im lặng', genreEn: 'Timing • Silent co-op', description: 'Không nói, không ra hiệu — cả phòng cùng cảm nhận một nhịp.', descriptionEn: 'No talking, no signals — find the same rhythm together.', duration: '10–20 min', color: '#818cf8', icon: Waves, ready: true },
];

interface HostGameSelectViewProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  players: Player[];
  onSelectGame: (gameId: string) => void;
  onBackToLobby: () => void;
}

export const HostGameSelectView: React.FC<HostGameSelectViewProps> = ({
  lang,
  onToggleLang,
  players,
  onSelectGame,
  onBackToLobby,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="party-shell min-h-screen bg-neutral-50 text-neutral-900 p-5 sm:p-10 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 max-w-6xl mx-auto w-full gap-4">
        <div>
          <span className="party-kicker">
            <Sparkles size={14} /> {t.hostScreen}
          </span>
          <h1 className="party-brand text-2xl sm:text-4xl font-black mt-1">{t.selectGameTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <HostAudioToggle />
          <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
          <button
            onClick={onBackToLobby}
            className="party-secondary text-sm font-semibold transition px-3 py-2 rounded-xl cursor-pointer"
          >
            {t.backToLobby}
          </button>
        </div>
      </div>

      {/* Game Selection List */}
      <div className="max-w-6xl mx-auto w-full my-8">
        <div className="party-glass rounded-2xl px-4 py-3 mb-6 flex flex-wrap gap-3 items-center justify-between">
          <p className="text-sm text-slate-300">{t.currentPlayersCount.replace('{n}', String(players.length))}</p>
          <span className="party-chip px-3 py-1.5 rounded-full text-xs font-bold">4–20 {lang === 'vi' ? 'người chơi' : 'players'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {GAMES.map((game, index) => {
            const Icon = game.icon;
            const disabledByPlayers = game.ready && players.length < 4;
            return (
              <article
                key={game.id}
                className={`game-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${game.ready ? 'game-card-ready' : ''}`}
                style={{ '--game-glow': game.color } as React.CSSProperties}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="game-icon"><Icon size={24} strokeWidth={2.2} /></div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${game.ready ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                      {game.ready ? (lang === 'vi' ? 'Sẵn sàng' : 'Ready') : t.comingSoon}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.16em]">Game {index + 1} • {game.duration}</span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">{lang === 'vi' ? game.title : game.titleEn}</h2>
                  <p className="text-xs font-semibold mb-3" style={{ color: game.color }}>{lang === 'vi' ? game.genre : game.genreEn}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">{lang === 'vi' ? game.description : game.descriptionEn}</p>
                </div>

                {game.ready ? (
                  <div className="relative z-10">
                    <button
                      disabled={disabledByPlayers}
                      onClick={() => {
                        playHostSound('start');
                        onSelectGame(game.id);
                      }}
                      className="party-primary w-full py-3 px-4 font-bold rounded-xl transition active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                    >
                      {disabledByPlayers ? t.needMin4PlayersBtn : t.chooseThisGame}
                    </button>
                    {disabledByPlayers && <p className="text-[11px] text-slate-500 text-center mt-2">{t.needMorePlayers.replace('{current}', String(players.length)).replace('{needed}', String(4 - players.length))}</p>}
                  </div>
                ) : (
                  <button disabled className="relative z-10 w-full py-3 px-4 bg-white/5 border border-white/10 text-slate-500 font-semibold rounded-xl cursor-not-allowed text-sm">{t.notOpenYet}</button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <Footer className="max-w-6xl mx-auto w-full" />
    </div>
  );
};
