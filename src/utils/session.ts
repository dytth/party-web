import type { Player } from '../types';
import type { TheLostSpyGameState } from '../games/the-lost-spy/types';
import type { SuiteGameState } from '../games/suite/types';

const PLAYER_SESSION_KEY = 'ccparty_player_session';
const HOST_SESSION_KEY = 'ccparty_host_session';

export interface PlayerSession {
  roomCode: string;
  playerId: string;
  playerName: string;
}

export interface HostSession {
  roomCode: string;
  players: Player[];
  stage: string;
  game1State?: TheLostSpyGameState | null;
  suiteState?: SuiteGameState | null;
}

// ------------------------------------------------
// PLAYER SESSION
// ------------------------------------------------
export function savePlayerSession(session: PlayerSession): void {
  try {
    sessionStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save player session', err);
  }
}

export function getPlayerSession(): PlayerSession | null {
  try {
    const data = sessionStorage.getItem(PLAYER_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearPlayerSession(): void {
  try {
    sessionStorage.removeItem(PLAYER_SESSION_KEY);
  } catch {}
}

// ------------------------------------------------
// HOST SESSION
// ------------------------------------------------
export function saveHostSession(session: HostSession): void {
  try {
    sessionStorage.setItem(HOST_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save host session', err);
  }
}

export function getHostSession(): HostSession | null {
  try {
    const data = sessionStorage.getItem(HOST_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearHostSession(): void {
  try {
    sessionStorage.removeItem(HOST_SESSION_KEY);
  } catch {}
}

// Generate persistent unique ID for player
export function getOrCreatePlayerId(): string {
  const existing = getPlayerSession()?.playerId;
  if (existing) return existing;

  const newId = 'p_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
  return newId;
}
