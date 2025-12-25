
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameMode, KanaCharacter, ScoreData } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../constants';
import { Home, Trophy, Sparkles, Lightbulb } from 'lucide-react';
import { getMnemonic } from '../services/geminiService';

interface QuizGameProps {
  mode: GameMode;
  onHome: () => void;
  highScores: ScoreData;
  updateHighScore: (mode: GameMode, score: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ mode, onHome, highScores, updateHighScore }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<KanaCharacter | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);
  
  // Use ref for lastIndex to avoid re-triggering useCallback dependencies
  const lastIndexRef = useRef<number>(-1);

  const pool = useMemo(() => {
    if (mode === 'hiragana') return HIRAGANA_DATA;
    if (mode === 'katakana') return KATAKANA_DATA;
    return [...HIRAGANA_DATA, ...KATAKANA_DATA];
  }, [mode]);

  const generateQuestion = useCallback(() => {
    if (pool.length === 0) return;

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * pool.length);
    } while (newIndex === lastIndexRef.current && pool.length > 1);

    const char = pool[newIndex];
    lastIndexRef.current = newIndex;
    
    setCurrentCharacter(char);
    setSelectedOption(null);
    setFeedback(null);
    setMnemonic(null);

    // Generate 4 options (1 correct, 3 wrong)
    const otherOptions = pool
      .filter(c => c.thai !== char.thai)
      .map(c => c.thai);
    
    // Shuffle and pick 3 unique wrong answers
    const shuffledOthers = [...new Set(otherOptions)].sort(() => Math.random() - 0.5);
    const finalOptions = [char.thai, ...shuffledOthers.slice(0, 3)].sort(() => Math.random() - 0.5);
    
    setOptions(finalOptions);
  }, [pool]);

  // Initial generation
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelect = async (option: string) => {
    if (feedback || !currentCharacter) return;

    setSelectedOption(option);
    const isCorrect = option === currentCharacter.thai;

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > highScores[mode]) {
        updateHighScore(mode, newStreak);
      }
      
      // Auto advance after correct answer
      setTimeout(() => {
        generateQuestion();
      }, 800);
    } else {
      setFeedback('wrong');
      setIsShaking(true);
      setCurrentStreak(0);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleShowMnemonic = async () => {
    if (!currentCharacter || loadingMnemonic) return;
    setLoadingMnemonic(true);
    const text = await getMnemonic(currentCharacter.char, currentCharacter.category);
    setMnemonic(text);
    setLoadingMnemonic(false);
  };

  if (!currentCharacter) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col p-6 transition-colors duration-500 ${
      feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : 'bg-slate-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onHome}
          className="p-2 bg-white rounded-full shadow-sm text-slate-500 active:scale-90 transition-transform"
        >
          <Home size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Streak</span>
          <span className="text-3xl font-black text-slate-700">{currentStreak}</span>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Trophy size={16} />
            <span>{highScores[mode]}</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase">Best</span>
        </div>
      </div>

      {/* Question Card */}
      <div className={`flex-1 flex flex-col items-center justify-center mb-8 relative ${isShaking ? 'animate-shake' : ''}`}>
        <div className={`w-full aspect-square max-w-[280px] bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 transition-colors duration-300 ${
          feedback === 'correct' ? 'border-green-400' : feedback === 'wrong' ? 'border-red-400' : 'border-slate-100'
        }`}>
          <div className="flex flex-col items-center">
            <span className="japanese-font text-8xl md:text-9xl font-bold text-slate-800">
              {currentCharacter.char}
            </span>
            {feedback === 'wrong' && (
              <div className="mt-4 animate-bounce">
                <span className="text-2xl font-bold text-red-500">
                  {currentCharacter.thai} ({currentCharacter.romaji})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button for Mnemonics */}
        {feedback === 'wrong' && !mnemonic && (
          <button 
            onClick={handleShowMnemonic}
            disabled={loadingMnemonic}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors"
          >
            <Lightbulb size={16} />
            {loadingMnemonic ? 'กำลังขอเคล็ดลับ...' : 'ขอเคล็ดลับช่วยจำ'}
          </button>
        )}

        {mnemonic && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm text-center italic shadow-sm animate-fade-in">
            {mnemonic}
          </div>
        )}

        {feedback === 'correct' && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Sparkles className="text-green-400 w-24 h-24 animate-pulse" />
           </div>
        )}
      </div>

      {/* Answer Grid */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        {options.map((opt) => {
          let btnClass = "h-20 rounded-2xl text-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center ";
          
          if (feedback === null) {
            btnClass += "bg-white text-slate-700 border-2 border-slate-100 hover:border-slate-200";
          } else {
            if (opt === currentCharacter.thai) {
              btnClass += "bg-green-500 text-white border-green-500";
            } else if (opt === selectedOption && opt !== currentCharacter.thai) {
              btnClass += "bg-red-500 text-white border-red-500";
            } else {
              btnClass += "bg-white text-slate-300 border-2 border-slate-50 opacity-50";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={feedback !== null}
              className={btnClass}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === 'wrong' && (
        <button
          onClick={generateQuestion}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 active:scale-95 transition-transform"
        >
          ลองใหม่ข้อถัดไป
        </button>
      )}
    </div>
  );
};
