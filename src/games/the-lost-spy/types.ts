export type GameStage = 'MEMORIZE' | 'DESCRIBE' | 'VOTE' | 'RESULT' | 'GAME_OVER';

export interface PlayerRoleState {
  id: string;
  name: string;
  role: 'CIVILIAN' | 'SPY';
  word: string;
  wordEn: string;
  isAlive: boolean;
}

export interface GameAnnouncement {
  title?: string;
  message?: string;
  titleVi?: string;
  titleEn?: string;
  messageVi?: string;
  messageEn?: string;
  type: 'danger' | 'success' | 'warning';
}

export interface TheLostSpyGameState {
  stage: GameStage;
  round: number;
  wordCivilian: string;
  wordCivilianEn: string;
  wordSpy: string;
  wordSpyEn: string;
  nature: string;
  spyId: string;
  playerRoles: Record<string, PlayerRoleState>;
  turnOrder: string[]; // List of player IDs in turn order
  currentTurnIndex: number; // Current index in turnOrder
  votes: Record<string, string>; // voterId -> targetPlayerId
  eliminatedId: string | null;
  winner: 'CIVILIANS' | 'SPY' | null;
  announcement: GameAnnouncement | null;
}

// Client-facing public state sent from Host to Players
export interface TheLostSpyClientState {
  stage: GameStage;
  round: number;
  myWord: string;
  myWordEn: string;
  nature: string;
  isAlive: boolean;
  myPlayerId: string;
  currentSpeakerId: string | null;
  currentSpeakerName: string | null;
  isMyTurn: boolean;
  alivePlayers: { id: string; name: string }[];
  hasVoted: boolean;
  votedTargetId: string | null;
  eliminatedName: string | null;
  eliminatedWasSpy: boolean | null;
  winner: 'CIVILIANS' | 'SPY' | null;
  announcement: GameAnnouncement | null;
}

export type TheLostSpyMessage =
  | { type: 'SPY_INIT'; clientState: TheLostSpyClientState }
  | { type: 'SPY_STAGE_UPDATE'; clientState: TheLostSpyClientState }
  | { type: 'SPY_VOTE'; voterId: string; targetId: string }
  | { type: 'SPY_GUESS_WORD'; playerId: string; guess: string };
