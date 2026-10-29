import React from 'react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import { Footer } from './Footer';
import { MonitorPlay, Smartphone, Sparkles, Users } from 'lucide-react';

interface HomeViewProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  onToggleLang,
  onCreateRoom,
  onJoinRoom,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="party-shell min-h-screen flex flex-col items-center justify-between p-5 sm:p-8 bg-neutral-50 text-neutral-900 relative overflow-hidden">
      {/* Top bar with EN/VI toggle */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <span className="party-kicker"><Sparkles size={14} /> Circus Cyber</span>
        <LanguageToggle currentLang={lang} onToggle={onToggleLang} />
      </div>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-8 lg:gap-14 items-center my-auto py-10 sm:py-16">
        <section className="text-center lg:text-left">
          <span className="party-chip inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            {lang === 'vi' ? 'Biến mọi màn hình thành sân khấu' : 'Turn every screen into a stage'}
          </span>
          <h1 className="party-brand text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.06em] leading-[0.88] mb-5">
            PARTY<br />NIGHT
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t.appSubtitle}. {lang === 'vi' ? 'Tạo phòng, kết nối điện thoại và bắt đầu cuộc vui.' : 'Create a room, connect your phones, and start the party.'}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-7 text-xs font-semibold text-slate-300">
            <span className="party-chip inline-flex items-center gap-2 px-3 py-2 rounded-xl"><Users size={15} /> 4–20 {lang === 'vi' ? 'người' : 'players'}</span>
            <span className="party-chip inline-flex items-center gap-2 px-3 py-2 rounded-xl"><Smartphone size={15} /> {lang === 'vi' ? 'Không cần cài app' : 'No app required'}</span>
            <span className="party-chip inline-flex items-center gap-2 px-3 py-2 rounded-xl"><MonitorPlay size={15} /> Host + Mobile</span>
          </div>
        </section>

        <section className="party-glass w-full max-w-md mx-auto rounded-3xl p-5 sm:p-7 relative">
          <div className="absolute -top-5 -right-3 w-14 h-14 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-300/20 grid place-items-center party-float text-2xl">✦</div>
          <div className="text-left mb-6">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-cyan-300">{t.appName}</span>
            <h2 className="text-2xl font-bold mt-2">{lang === 'vi' ? 'Bạn muốn chơi thế nào?' : 'How do you want to play?'}</h2>
            <p className="text-sm text-slate-400 mt-1">{lang === 'vi' ? 'Host tạo sân khấu, người chơi dùng điện thoại để tương tác.' : 'The host runs the stage; players interact from their phones.'}</p>
          </div>

          <div className="w-full space-y-3">
          <button
            onClick={onCreateRoom}
            className="party-primary w-full py-4 px-6 text-white text-lg font-bold rounded-2xl transition active:scale-[0.99] cursor-pointer"
          >
            {t.createRoom}
          </button>

          <button
            onClick={onJoinRoom}
            className="party-secondary w-full py-4 px-6 text-lg font-bold rounded-2xl transition active:scale-[0.99] cursor-pointer"
          >
            {t.joinRoom}
          </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
