
export type KanaType = 'basic' | 'dakuon' | 'handakuon';
export type GameMode = 'hiragana' | 'katakana' | 'mixed';

export interface KanaCharacter {
  char: string;
  romaji: string;
  thai: string;
  type: KanaType;
  category: 'hiragana' | 'katakana';
}

export interface GameState {
  mode: GameMode;
  currentScore: number;
  highScore: number;
  lastCharIndex: number;
}

export interface ScoreData {
  hiragana: number;
  katakana: number;
  mixed: number;
}
