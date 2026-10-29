import type { Player } from '../../types.ts';
import type { PlayerRoleState, TheLostSpyGameState } from './types.ts';
import type { WordPair } from './words.ts';

export type VoteValidationError =
  | 'NOT_VOTING'
  | 'UNKNOWN_VOTER'
  | 'VOTER_ELIMINATED'
  | 'UNKNOWN_TARGET'
  | 'TARGET_ELIMINATED'
  | 'SELF_VOTE';

export type VoteResolution =
  | { status: 'INCOMPLETE'; missingVoterIds: string[] }
  | { status: 'NO_VOTES' }
  | { status: 'TIE'; tiedPlayerIds: string[]; votes: number }
  | { status: 'ELIMINATED'; eliminatedId: string; votes: number };

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createGameState(
  players: readonly Player[],
  wordPair: WordPair,
  random: () => number = Math.random
): TheLostSpyGameState {
  if (players.length === 0) throw new Error('Cannot create a game without players.');

  const spyIndex = Math.floor(random() * players.length);
  const spy = players[spyIndex];
  const playerRoles: Record<string, PlayerRoleState> = {};

  players.forEach((player) => {
    const isSpy = player.id === spy.id;
    playerRoles[player.id] = {
      id: player.id,
      name: player.name,
      role: isSpy ? 'SPY' : 'CIVILIAN',
      word: isSpy ? wordPair.spy : wordPair.civilian,
      wordEn: isSpy ? wordPair.spyEn : wordPair.civilianEn,
      isAlive: true,
    };
  });

  return {
    stage: 'MEMORIZE',
    round: 1,
    wordCivilian: wordPair.civilian,
    wordCivilianEn: wordPair.civilianEn,
    wordSpy: wordPair.spy,
    wordSpyEn: wordPair.spyEn,
    nature: wordPair.nature,
    spyId: spy.id,
    playerRoles,
    turnOrder: shuffle(players.map((player) => player.id), random),
    currentTurnIndex: 0,
    votes: {},
    eliminatedId: null,
    winner: null,
    announcement: null,
  };
}

export function validateVote(
  state: TheLostSpyGameState,
  voterId: string,
  targetId: string
): VoteValidationError | null {
  if (state.stage !== 'VOTE') return 'NOT_VOTING';
  const voter = state.playerRoles[voterId];
  const target = state.playerRoles[targetId];
  if (!voter) return 'UNKNOWN_VOTER';
  if (!voter.isAlive) return 'VOTER_ELIMINATED';
  if (!target) return 'UNKNOWN_TARGET';
  if (!target.isAlive) return 'TARGET_ELIMINATED';
  if (voterId === targetId) return 'SELF_VOTE';
  return null;
}

export function applyVote(
  state: TheLostSpyGameState,
  voterId: string,
  targetId: string
): TheLostSpyGameState {
  const error = validateVote(state, voterId, targetId);
  if (error) return state;
  return { ...state, votes: { ...state.votes, [voterId]: targetId } };
}

export function resolveVotes(state: TheLostSpyGameState): VoteResolution {
  const aliveIds = Object.values(state.playerRoles)
    .filter((player) => player.isAlive)
    .map((player) => player.id);
  const missingVoterIds = aliveIds.filter((id) => !state.votes[id]);
  if (missingVoterIds.length > 0) return { status: 'INCOMPLETE', missingVoterIds };

  const counts: Record<string, number> = {};
  Object.values(state.votes).forEach((targetId) => {
    if (aliveIds.includes(targetId)) counts[targetId] = (counts[targetId] ?? 0) + 1;
  });
  const entries = Object.entries(counts);
  if (entries.length === 0) return { status: 'NO_VOTES' };

  const highest = Math.max(...entries.map(([, count]) => count));
  const tiedPlayerIds = entries
    .filter(([, count]) => count === highest)
    .map(([id]) => id);
  if (tiedPlayerIds.length > 1) return { status: 'TIE', tiedPlayerIds, votes: highest };
  return { status: 'ELIMINATED', eliminatedId: tiedPlayerIds[0], votes: highest };
}

export function getAliveTurnOrder(state: TheLostSpyGameState, random: () => number = Math.random): string[] {
  return shuffle(
    Object.values(state.playerRoles)
      .filter((player) => player.isAlive)
      .map((player) => player.id),
    random
  );
}

export function determineWinner(
  playerRoles: Record<string, PlayerRoleState>
): TheLostSpyGameState['winner'] {
  const alive = Object.values(playerRoles).filter((player) => player.isAlive);
  const spyAlive = alive.some((player) => player.role === 'SPY');
  if (!spyAlive) return 'CIVILIANS';
  const civilianCount = alive.filter((player) => player.role === 'CIVILIAN').length;
  return civilianCount <= 1 ? 'SPY' : null;
}
