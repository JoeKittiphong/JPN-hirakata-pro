
import React from 'react';
import { GameMode, ScoreData } from '../types';
import { Book, Zap, Layers, Trophy } from 'lucide-react';

interface GameModeSelectorProps {
  onSelect: (mode: GameMode) => void;
  highScores: ScoreData;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelect, highScores }) => {
  const modes = [
    {
      id: 'hiragana' as GameMode,
      title: 'Hiragana',
      desc: 'ฮิระกะนะ (พื้นฐาน)',
      icon: <Book className="text-rose-500" />,
      color: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
      textColor: 'text-rose-700',
      score: highScores.hiragana
    },
    {
      id: 'katakana' as GameMode,
      title: 'Katakana',
      desc: 'คะตะคะนะ (ยืมคำต่างชาติ)',
      icon: <Zap className="text-sky-500" />,
      color: 'bg-sky-50 border-sky-100 hover:bg-sky-100',
      textColor: 'text-sky-700',
      score: highScores.katakana
    },
    {
      id: 'mixed' as GameMode,
      title: 'Mixed Mode',
      desc: 'ท้าทายรวมทั้งสองแบบ',
      icon: <Layers className="text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
      textColor: 'text-indigo-700',
      score: highScores.mixed
    }
  ];

  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in">
      <div className="mt-12 mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">KanaQuest</h1>
        <p className="text-slate-500">ฝึกภาษาญี่ปุ่นง่ายๆ ได้ทุกวัน</p>
      </div>

      <div className="space-y-4 flex-1">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-95 ${mode.color}`}
          >
            <div className="p-3 bg-white rounded-xl shadow-sm">
              {mode.icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className={`text-xl font-bold ${mode.textColor}`}>{mode.title}</h3>
              <p className="text-slate-500 text-sm">{mode.desc}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                <Trophy size={14} />
                <span>{mode.score}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto py-6 text-center text-slate-400 text-xs">
        v1.0.0 • Designed for Beginners
      </div>
    </div>
  );
};
