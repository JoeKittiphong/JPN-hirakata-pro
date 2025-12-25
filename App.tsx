
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { GameModeSelector } from './components/GameModeSelector';
import { QuizGame } from './components/QuizGame';
import { GameMode, ScoreData } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [highScores, setHighScores] = useState<ScoreData>({
    hiragana: 0,
    katakana: 0,
    mixed: 0
  });

  // Load scores on mount
  useEffect(() => {
    const saved = localStorage.getItem('kanaquest_scores');
    if (saved) {
      try {
        setHighScores(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scores", e);
      }
    }
  }, []);

  const updateHighScore = (mode: GameMode, score: number) => {
    const newScores = { ...highScores, [mode]: score };
    setHighScores(newScores);
    localStorage.setItem('kanaquest_scores', JSON.stringify(newScores));
  };

  return (
    <Layout>
      {!currentMode ? (
        <GameModeSelector 
          onSelect={setCurrentMode} 
          highScores={highScores} 
        />
      ) : (
        <QuizGame 
          mode={currentMode} 
          onHome={() => setCurrentMode(null)} 
          highScores={highScores}
          updateHighScore={updateHighScore}
        />
      )}
    </Layout>
  );
};

export default App;
