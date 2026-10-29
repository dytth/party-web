import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isHostMuted, toggleHostMute } from '../utils/sound';

export const HostAudioToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState(isHostMuted());

  const handleToggle = () => {
    const next = toggleHostMute();
    setMuted(next);
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Bật âm thanh Host (Unmute)' : 'Tắt âm thanh Host (Mute)'}
      className={`p-2 rounded-xl transition border cursor-pointer ${
        muted
          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
      } ${className}`}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
};
