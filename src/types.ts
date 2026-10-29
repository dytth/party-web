import { TheLostSpyClientState } from './games/the-lost-spy/types';
import type { SuiteAction, SuiteClientState } from './games/suite/types';

export interface Player {
  id: string; // Persistent player ID
  name: string;
  isOnline?: boolean;
}

export type NetworkMessage =
  | { type: 'JOIN'; playerId: string; name: string }
  | { type: 'RECONNECT'; playerId: string; name: string }
  | { type: 'JOINED'; roomCode: string; playerId: string; name: string; stage?: string }
  | { type: 'JOIN_REJECTED'; reason: 'ROOM_FULL' | 'GAME_IN_PROGRESS' | 'INVALID_NAME' }
  | { type: 'CHANGE_NAME'; playerId: string; newName: string }
  | { type: 'NAME_CHANGED'; playerId: string; newName: string }
  | { type: 'PLAYERS_UPDATE'; players: Player[] }
  | { type: 'HOST_STAGE_CHANGE'; stage: string; gameId?: string }
  | { type: 'SPY_UPDATE'; clientState: TheLostSpyClientState }
  | { type: 'SPY_VOTE'; voterId: string; targetId: string }
  | { type: 'SPY_GUESS_WORD'; playerId: string; guess: string }
  | { type: 'SUITE_UPDATE'; clientState: SuiteClientState }
  | { type: 'SUITE_ACTION'; playerId: string; action: SuiteAction }
  | { type: 'ROOM_CLOSED' }
  | { type: 'KICKED'; reason?: string }
  | { type: 'HEARTBEAT' }
  | { type: 'HEARTBEAT_ACK' };
