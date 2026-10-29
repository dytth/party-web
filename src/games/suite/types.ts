import type { Player } from '../../types.ts';

export type SuiteGameId = 'fake-artist' | 'codenames' | 'most-likely' | 'just-one' | 'the-mind';
export type Point = { x: number; y: number };
export type Stroke = { playerId: string; color: string; points: Point[] };
export type Team = 'RED' | 'BLUE';

export interface FakeArtistState {
  gameId: 'fake-artist'; stage: 'DRAW' | 'VOTE' | 'FAKE_GUESS' | 'GAME_OVER'; players: Player[];
  topic: string; topicEn: string; fakeId: string; turnOrder: string[]; turnIndex: number; round: number;
  strokes: Stroke[]; votes: Record<string, string>; accusedId: string | null; winner: 'ARTISTS' | 'FAKE' | null;
  tie?: boolean;
}
export interface CodeCard { word: string; wordEn?: string; role: Team | 'NEUTRAL' | 'ASSASSIN'; revealed: boolean; }
export interface CodenamesState {
  gameId: 'codenames'; stage: 'CLUE' | 'GUESS' | 'GAME_OVER'; players: Player[]; board: CodeCard[];
  teams: Record<string, Team>; spymasters: Record<Team, string>; currentTeam: Team; clue: string; clueNumber: number;
  guessesLeft: number; winner: Team | null; message: string;
}
export interface MostLikelyState {
  gameId: 'most-likely'; stage: 'VOTE' | 'RESULT' | 'GAME_OVER'; players: Player[]; round: number;
  prompt: string; promptEn: string; votes: Record<string, string>; scores: Record<string, number>; winners: string[];
  questions?: [string, string][];
}
export interface JustOneState {
  gameId: 'just-one'; stage: 'CLUE' | 'GUESS' | 'RESULT' | 'GAME_OVER'; players: Player[]; round: number;
  guesserId: string; word: string; wordEn: string; clues: Record<string, string>; validClues: string[];
  duplicateClues: string[]; answer: string; success: boolean | null; score: number;
}
export interface MindState {
  gameId: 'the-mind'; stage: 'PLAY' | 'LEVEL_RESULT' | 'GAME_OVER'; players: Player[]; level: number; lives: number;
  hands: Record<string, number[]>; pile: number[]; lastPlayedBy: string | null; lostCards: number[]; won: boolean | null;
}
export type SuiteGameState = FakeArtistState | CodenamesState | MostLikelyState | JustOneState | MindState;

export type SuiteAction =
  | { type: 'DRAW_STROKE'; points: Point[] }
  | { type: 'VOTE_PLAYER'; targetId: string }
  | { type: 'FAKE_GUESS'; guess: string }
  | { type: 'GIVE_CLUE'; clue: string; count: number }
  | { type: 'GUESS_CARD'; index: number }
  | { type: 'END_TURN' }
  | { type: 'SUBMIT_CLUE'; clue: string }
  | { type: 'SUBMIT_ANSWER'; answer: string }
  | { type: 'SKIP_ANSWER' }
  | { type: 'PLAY_CARD'; card: number };

export interface SuiteClientState {
  game: SuiteGameState;
  playerId: string;
  secret?: { role?: string; topic?: string; topicEn?: string; team?: Team; hand?: number[] };
}
