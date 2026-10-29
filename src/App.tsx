import React, { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { Player, NetworkMessage } from './types';
import { generateRoomCode, sanitizeRoomCode } from './utils/roomCode';
import {
  savePlayerSession,
  getPlayerSession,
  clearPlayerSession,
  saveHostSession,
  getHostSession,
  clearHostSession,
  getOrCreatePlayerId,
} from './utils/session';
import { HomeView } from './components/HomeView';
import { HostLobbyView } from './components/HostLobbyView';
import { HostGameSelectView } from './components/HostGameSelectView';
import { JoinView } from './components/JoinView';
import { PlayerWaitingView } from './components/PlayerWaitingView';
import { HostTheLostSpy } from './games/the-lost-spy/HostTheLostSpy';
import { PlayerTheLostSpy } from './games/the-lost-spy/PlayerTheLostSpy';
import {
  TheLostSpyGameState,
  TheLostSpyClientState,
} from './games/the-lost-spy/types';
import { getRandomWordPair, checkGuessMatch } from './games/the-lost-spy/words';
import { applyVote, createGameState, determineWinner, getAliveTurnOrder, resolveVotes } from './games/the-lost-spy/engine';
import { LOST_SPY_RULES } from './games/the-lost-spy/config';
import { Language, getSavedLanguage, saveLanguage } from './utils/i18n';
import { HostSuiteGame } from './games/suite/HostSuiteGame';
import { PlayerSuiteGame } from './games/suite/PlayerSuiteGame';
import { RTC_CONFIGURATION } from './utils/webrtcConfig';
import { playHostSound } from './utils/sound';
import { applySuiteAction, clientState, createSuiteGame, nextSuiteRound } from './games/suite/engine';
import type { SuiteAction, SuiteClientState, SuiteGameId, SuiteGameState } from './games/suite/types';

type AppView =
  | 'HOME'
  | 'HOST_LOBBY'
  | 'HOST_GAME_SELECT'
  | 'HOST_GAME_SPY'
  | 'HOST_GAME_SUITE'
  | 'JOIN_FORM'
  | 'PLAYER_WAITING'
  | 'PLAYER_GAME_SPY'
  | 'PLAYER_GAME_SUITE';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(getSavedLanguage);
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  // Reconnection state for players
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

  // GAME 1: THE LOST SPY STATE
  const [game1HostState, setGame1HostState] = useState<TheLostSpyGameState | null>(null);
  const [game1ClientState, setGame1ClientState] = useState<TheLostSpyClientState | null>(null);
  const [suiteHostState, setSuiteHostState] = useState<SuiteGameState | null>(null);
  const [suiteClientState, setSuiteClientState] = useState<SuiteClientState | null>(null);

  // References
  const peerRef = useRef<Peer | null>(null);
  const hostConnectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const playerConnRef = useRef<DataConnection | null>(null);
  const reconnectTimerRef = useRef<any>(null);
  const isKickedRef = useRef<boolean>(false);

  const currentViewRef = useRef<AppView>(currentView);
  currentViewRef.current = currentView;
  const playersRef = useRef<Player[]>(players);
  playersRef.current = players;
  const roomCodeRef = useRef<string>(roomCode);
  roomCodeRef.current = roomCode;
  const game1HostStateRef = useRef<TheLostSpyGameState | null>(game1HostState);
  game1HostStateRef.current = game1HostState;
  const suiteHostStateRef = useRef<SuiteGameState | null>(suiteHostState);
  suiteHostStateRef.current = suiteHostState;

  const cleanupPeer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    hostConnectionsRef.current.clear();
    playerConnRef.current = null;
  }, []);

  useEffect(() => () => cleanupPeer(), [cleanupPeer]);

  // ----------------------------------------------------
  // HELPER: COMPUTE CLIENT STATE FOR GAME 1
  // ----------------------------------------------------
  const computeClientState = (
    pId: string,
    gState: TheLostSpyGameState
  ): TheLostSpyClientState => {
    const playerRole = gState.playerRoles[pId];
    const myWord = playerRole ? playerRole.word : '';
    const myWordEn = playerRole ? playerRole.wordEn : '';
    const isAlive = playerRole ? playerRole.isAlive : false;

    const currentSpeakerId = gState.turnOrder[gState.currentTurnIndex] || null;
    const currentSpeaker = currentSpeakerId ? gState.playerRoles[currentSpeakerId] : null;

    const alivePlayers = Object.values(gState.playerRoles)
      .filter((p) => p.isAlive)
      .map((p) => ({ id: p.id, name: p.name }));

    const hasVoted = Boolean(gState.votes[pId]);
    const votedTargetId = gState.votes[pId] || null;

    const eliminatedPlayer = gState.eliminatedId ? gState.playerRoles[gState.eliminatedId] : null;

    return {
      stage: gState.stage,
      round: gState.round,
      myWord,
      myWordEn,
      nature: gState.nature,
      isAlive,
      myPlayerId: pId,
      currentSpeakerId,
      currentSpeakerName: currentSpeaker ? currentSpeaker.name : null,
      isMyTurn: currentSpeakerId === pId,
      alivePlayers,
      hasVoted,
      votedTargetId,
      eliminatedName: eliminatedPlayer ? eliminatedPlayer.name : null,
      eliminatedWasSpy: eliminatedPlayer ? eliminatedPlayer.role === 'SPY' : null,
      winner: gState.winner,
      announcement: gState.announcement,
    };
  };

  const broadcastGame1State = (gState: TheLostSpyGameState) => {
    hostConnectionsRef.current.forEach((conn, pId) => {
      try {
        const clientState = computeClientState(pId, gState);
        conn.send({
          type: 'SPY_UPDATE',
          clientState,
        } as NetworkMessage);
      } catch (e) {
        console.error('Error broadcasting game state to', pId, e);
      }
    });
  };

  const broadcastSuiteState = (gState: SuiteGameState) => {
    hostConnectionsRef.current.forEach((conn, pId) => {
      try { conn.send({ type: 'SUITE_UPDATE', clientState: clientState(gState, pId) } as NetworkMessage); } catch {}
    });
  };

  // ----------------------------------------------------
  // HOST: INITIALIZE OR RESTORE ROOM
  // ----------------------------------------------------
  const startHostRoom = useCallback((
    codeToUse: string,
    initialPlayers: Player[] = [],
    stage: AppView = 'HOST_LOBBY',
    restoredGameState: TheLostSpyGameState | null = null,
    restoredSuiteState: SuiteGameState | null = null
  ) => {
    cleanupPeer();
    setIsLoading(true);
    setErrorMessage('');

    const cleanCode = sanitizeRoomCode(codeToUse);
    const peerId = `ccparty-${cleanCode.toLowerCase()}`;
    const peer = new Peer(peerId, {
      debug: 1,
      config: RTC_CONFIGURATION,
    });

    peer.on('open', () => {
      setRoomCode(codeToUse);
      const restored = initialPlayers.map((p) => ({ ...p, isOnline: false }));
      setPlayers(restored);
      setIsLoading(false);
      const safeStage = (stage === 'HOST_GAME_SPY' && !restoredGameState) || (stage === 'HOST_GAME_SUITE' && !restoredSuiteState) ? 'HOST_LOBBY' : stage;
      setGame1HostState(restoredGameState);
      setSuiteHostState(restoredSuiteState);
      setCurrentView(safeStage);

      saveHostSession({
        roomCode: codeToUse,
        players: restored,
        stage: safeStage,
        game1State: restoredGameState,
        suiteState: restoredSuiteState,
      });
    });

    peer.on('connection', (conn) => {
      let registeredPlayerId = '';

      conn.on('data', (data) => {
        const msg = data as NetworkMessage;

        if (msg.type === 'JOIN' || msg.type === 'RECONNECT') {
          const cleanName = msg.name.trim().slice(0, LOST_SPY_RULES.maxNameLength);
          const existingPlayer = playersRef.current.find((player) => player.id === msg.playerId);
          const isGameRunning = currentViewRef.current === 'HOST_GAME_SPY' || currentViewRef.current === 'HOST_GAME_SUITE';
          const rejectionReason = !cleanName
            ? 'INVALID_NAME'
            : !existingPlayer && isGameRunning
              ? 'GAME_IN_PROGRESS'
              : !existingPlayer && playersRef.current.length >= LOST_SPY_RULES.maxPlayers
                ? 'ROOM_FULL'
                : null;
          if (rejectionReason) {
            conn.send({ type: 'JOIN_REJECTED', reason: rejectionReason } as NetworkMessage);
            setTimeout(() => conn.close(), 100);
            return;
          }

          registeredPlayerId = msg.playerId;
          hostConnectionsRef.current.set(msg.playerId, conn);

          setPlayers((prev) => {
            const index = prev.findIndex((p) => p.id === msg.playerId);
            let updated: Player[];
            if (index !== -1) {
              updated = [...prev];
              updated[index] = { ...updated[index], name: cleanName, isOnline: true };
            } else {
              updated = [...prev, { id: msg.playerId, name: cleanName, isOnline: true }];
            }
            saveHostSession({
              roomCode: codeToUse,
              players: updated,
              stage: currentViewRef.current,
              game1State: game1HostStateRef.current,
              suiteState: suiteHostStateRef.current,
            });
            return updated;
          });

          // Confirm join/reconnect success
          conn.send({
            type: 'JOINED',
            roomCode: codeToUse,
            playerId: msg.playerId,
            name: cleanName,
            stage: currentViewRef.current,
          } as NetworkMessage);

          // If game 1 is in progress, sync game state immediately
          if (game1HostStateRef.current && currentViewRef.current === 'HOST_GAME_SPY') {
            const clientState = computeClientState(msg.playerId, game1HostStateRef.current);
            conn.send({
              type: 'SPY_UPDATE',
              clientState,
            } as NetworkMessage);
          }
          if (suiteHostStateRef.current && currentViewRef.current === 'HOST_GAME_SUITE') {
            conn.send({ type: 'SUITE_UPDATE', clientState: clientState(suiteHostStateRef.current, msg.playerId) } as NetworkMessage);
          }
        } else if (msg.type === 'SPY_VOTE') {
          if (registeredPlayerId && registeredPlayerId === msg.voterId && game1HostStateRef.current) {
            const updatedState = applyVote(game1HostStateRef.current, registeredPlayerId, msg.targetId);
            if (updatedState === game1HostStateRef.current) return;
            setGame1HostState(updatedState);
            broadcastGame1State(updatedState);
          }
        } else if (msg.type === 'SPY_GUESS_WORD') {
          if (registeredPlayerId && registeredPlayerId === msg.playerId) {
            handleGame1GuessWord(registeredPlayerId, msg.guess.slice(0, 80));
          }
        } else if (msg.type === 'SUITE_ACTION') {
          if (registeredPlayerId && registeredPlayerId === msg.playerId && suiteHostStateRef.current) {
            const updated = applySuiteAction(suiteHostStateRef.current, registeredPlayerId, msg.action);
            if (updated !== suiteHostStateRef.current) { setSuiteHostState(updated); suiteHostStateRef.current = updated; broadcastSuiteState(updated); }
          }
        } else if (msg.type === 'CHANGE_NAME') {
          const cleanName = msg.newName.trim().slice(0, LOST_SPY_RULES.maxNameLength);
          if (!cleanName) return;

          setPlayers((prev) => {
            const updated = prev.map((p) => (p.id === msg.playerId ? { ...p, name: cleanName } : p));
            saveHostSession({
              roomCode: cleanCode,
              players: updated,
              stage: currentViewRef.current,
              game1State: game1HostStateRef.current,
              suiteState: suiteHostStateRef.current,
            });
            return updated;
          });

          if (game1HostStateRef.current && game1HostStateRef.current.playerRoles[msg.playerId]) {
            setGame1HostState((prev) => {
              if (!prev || !prev.playerRoles[msg.playerId]) return prev;
              const updated: TheLostSpyGameState = {
                ...prev,
                playerRoles: {
                  ...prev.playerRoles,
                  [msg.playerId]: {
                    ...prev.playerRoles[msg.playerId],
                    name: cleanName,
                  },
                },
              };
              return updated;
            });
          }

          if (suiteHostStateRef.current) {
            setSuiteHostState((prev) => {
              if (!prev) return prev;
              const updated: SuiteGameState = {
                ...prev,
                players: prev.players.map((p) => (p.id === msg.playerId ? { ...p, name: cleanName } : p)),
              };
              return updated;
            });
          }

          conn.send({
            type: 'NAME_CHANGED',
            playerId: msg.playerId,
            newName: cleanName,
          } as NetworkMessage);

          const updatedPlayers = playersRef.current.map((p) => (p.id === msg.playerId ? { ...p, name: cleanName } : p));
          hostConnectionsRef.current.forEach((c) => {
            try {
              c.send({
                type: 'PLAYERS_UPDATE',
                players: updatedPlayers,
              } as NetworkMessage);
            } catch {}
          });

          playHostSound('pop');
        }
      });

      conn.on('close', () => {
        if (registeredPlayerId) {
          hostConnectionsRef.current.delete(registeredPlayerId);
          setPlayers((prev) => {
            const updated = prev.map((p) =>
              p.id === registeredPlayerId ? { ...p, isOnline: false } : p
            );
            saveHostSession({
              roomCode: codeToUse,
              players: updated,
              stage: currentViewRef.current,
              game1State: game1HostStateRef.current,
              suiteState: suiteHostStateRef.current,
            });
            return updated;
          });
        }
      });

      conn.on('error', () => {
        if (registeredPlayerId) {
          hostConnectionsRef.current.delete(registeredPlayerId);
          setPlayers((prev) => {
            const updated = prev.map((p) =>
              p.id === registeredPlayerId ? { ...p, isOnline: false } : p
            );
            saveHostSession({
              roomCode: codeToUse,
              players: updated,
              stage: currentViewRef.current,
              game1State: game1HostStateRef.current,
              suiteState: suiteHostStateRef.current,
            });
            return updated;
          });
        }
      });
    });

    peer.on('disconnected', () => {
      console.warn('Host lost signaling connection, reconnecting...');
      if (peer && !peer.destroyed) {
        try {
          peer.reconnect();
        } catch (e) {
          console.error('Reconnect failed', e);
        }
      }
    });

    peer.on('error', (err: any) => {
      console.error('Host peer error:', err);
      if (err.type === 'unavailable-id') {
        setErrorMessage(lang === 'vi' ? 'Phòng này đang được mở ở một màn hình Host khác.' : 'This room is already open on another Host screen.');
        setIsLoading(false);
      } else {
        setErrorMessage('Không thể khởi tạo phòng. Đang thử lại...');
        setIsLoading(false);
      }
    });

    peerRef.current = peer;
  }, [cleanupPeer]);

  const handleCreateRoom = () => {
    clearHostSession();
    clearPlayerSession();
    const newCode = generateRoomCode(4);
    startHostRoom(newCode, [], 'HOST_LOBBY');
  };

  // ----------------------------------------------------
  // PLAYER: CONNECT / RECONNECT TO HOST
  // ----------------------------------------------------
  const connectToHostAsPlayer = useCallback((
    targetCode: string,
    nameToUse: string,
    pId: string,
    attemptCount = 0
  ) => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (attemptCount === 0) {
      setIsLoading(true);
      setErrorMessage('');
    } else {
      setIsReconnecting(true);
      setReconnectAttempt(attemptCount);
    }

    const cleanCode = sanitizeRoomCode(targetCode);
    const targetPeerId = `ccparty-${cleanCode.toLowerCase()}`;
    const peer = new Peer({
      debug: 1,
      config: RTC_CONFIGURATION,
    });

    let connTimeout: any = null;

    peer.on('open', () => {
      const conn = peer.connect(targetPeerId, { reliable: true });

      connTimeout = setTimeout(() => {
        console.warn('P2P connection timeout (12s) - retrying via ICE/TURN candidates');
        handlePlayerDisconnect(cleanCode, nameToUse, pId, attemptCount);
      }, 12000);

      conn.on('open', () => {
        clearTimeout(connTimeout);
        playerConnRef.current = conn;

        conn.send({
          type: attemptCount > 0 ? 'RECONNECT' : 'JOIN',
          playerId: pId,
          name: nameToUse,
        } as NetworkMessage);
      });

      conn.on('data', (data) => {
        const msg = data as NetworkMessage;
        if (msg.type === 'JOINED') {
          clearTimeout(connTimeout);
          setIsLoading(false);
          setIsReconnecting(false);
          setReconnectAttempt(0);
          setRoomCode(targetCode);
          setPlayerName(nameToUse);
          if (currentViewRef.current !== 'PLAYER_GAME_SPY' && currentViewRef.current !== 'PLAYER_GAME_SUITE') {
            setCurrentView('PLAYER_WAITING');
          }

          savePlayerSession({
            roomCode: targetCode,
            playerName: nameToUse,
            playerId: pId,
          });
        } else if (msg.type === 'SPY_UPDATE') {
          setGame1ClientState(msg.clientState);
          setCurrentView('PLAYER_GAME_SPY');
        } else if (msg.type === 'SUITE_UPDATE') {
          setSuiteClientState(msg.clientState);
          setCurrentView('PLAYER_GAME_SUITE');
        } else if (msg.type === 'JOIN_REJECTED') {
          const messages = {
            ROOM_FULL: lang === 'vi'
              ? `Phòng đã đủ ${LOST_SPY_RULES.maxPlayers} người.`
              : `The room is full (${LOST_SPY_RULES.maxPlayers} players).`,
            GAME_IN_PROGRESS: lang === 'vi' ? 'Ván chơi đã bắt đầu. Hãy chờ ván sau.' : 'A game is already in progress.',
            INVALID_NAME: lang === 'vi' ? 'Tên người chơi không hợp lệ.' : 'Invalid player name.',
          };
          isKickedRef.current = true;
          clearPlayerSession();
          setIsLoading(false);
          setIsReconnecting(false);
          setErrorMessage(messages[msg.reason]);
          setCurrentView('JOIN_FORM');
        } else if (msg.type === 'NAME_CHANGED') {
          if (msg.playerId === pId) {
            setPlayerName(msg.newName);
            savePlayerSession({
              roomCode: cleanCode,
              playerName: msg.newName,
              playerId: pId,
            });
          }
        } else if (msg.type === 'HOST_STAGE_CHANGE') {
          if (msg.stage === 'WAITING' || msg.stage === 'LOBBY') {
            setGame1ClientState(null);
            setSuiteClientState(null);
            setCurrentView('PLAYER_WAITING');
          }
        } else if (msg.type === 'ROOM_CLOSED') {
          clearPlayerSession();
          alert(lang === 'vi' ? 'Chủ phòng đã đóng phòng chơi.' : 'The host has closed the room.');
          setCurrentView('HOME');
        } else if (msg.type === 'KICKED') {
          isKickedRef.current = true;
          clearPlayerSession();
          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
          }
          try {
            playerConnRef.current?.close();
          } catch {}
          try {
            peerRef.current?.destroy();
            peerRef.current = null;
          } catch {}
          alert(lang === 'vi' ? 'Bạn đã bị Host mời ra khỏi phòng.' : 'You have been removed from the room by the Host.');
          setCurrentView('HOME');
        }
      });

      conn.on('close', () => {
        handlePlayerDisconnect(cleanCode, nameToUse, pId, attemptCount);
      });

      conn.on('error', () => {
        handlePlayerDisconnect(cleanCode, nameToUse, pId, attemptCount);
      });
    });

    peer.on('error', (err: any) => {
      clearTimeout(connTimeout);
      console.warn('Player peer error:', err);

      if (err?.type === 'peer-unavailable') {
        if (attemptCount >= 2) {
          setIsLoading(false);
          setIsReconnecting(false);
          setErrorMessage(
            lang === 'vi'
              ? `Không tìm thấy phòng chơi "${cleanCode}". Hãy kiểm tra lại mã phòng hoặc đảm bảo Host vẫn đang mở phòng!`
              : `Room "${cleanCode}" not found. Please check room code or ensure Host is still open.`
          );
          clearPlayerSession();
          setCurrentView('JOIN_FORM');
          return;
        }
        reconnectTimerRef.current = setTimeout(() => {
          cleanupPeer();
          connectToHostAsPlayer(cleanCode, nameToUse, pId, attemptCount + 1);
        }, 1200);
        return;
      }

      handlePlayerDisconnect(cleanCode, nameToUse, pId, attemptCount);
    });

    peerRef.current = peer;
  }, [cleanupPeer]);

  const handlePlayerDisconnect = (
    targetCode: string,
    nameToUse: string,
    pId: string,
    currentAttempts: number
  ) => {
    if (isKickedRef.current) {
      return;
    }

    if (currentAttempts >= 10) {
      setIsReconnecting(false);
      setIsLoading(false);
      setErrorMessage(
        lang === 'vi'
          ? 'Không thể kết nối lại với Host sau nhiều lần thử. Vui lòng kiểm tra lại kết nối mạng hoặc thử vào lại phòng.'
          : 'Unable to reconnect to Host after multiple attempts. Please check network connection or try again.'
      );
      clearPlayerSession();
      setCurrentView('JOIN_FORM');
      return;
    }

    setIsReconnecting(true);
    setReconnectAttempt(currentAttempts + 1);

    reconnectTimerRef.current = setTimeout(() => {
      cleanupPeer();
      connectToHostAsPlayer(targetCode, nameToUse, pId, currentAttempts + 1);
    }, 2000);
  };

  const handleJoinRoom = (code: string, name: string) => {
    isKickedRef.current = false;
    clearHostSession();
    clearPlayerSession();
    const pId = getOrCreatePlayerId();
    connectToHostAsPlayer(code, name, pId, 0);
  };

  const handleChangePlayerName = (newName: string) => {
    const cleanName = newName.trim().slice(0, LOST_SPY_RULES.maxNameLength);
    if (!cleanName || cleanName === playerName) return;

    const pId = getOrCreatePlayerId();
    setPlayerName(cleanName);
    savePlayerSession({
      roomCode,
      playerName: cleanName,
      playerId: pId,
    });

    if (playerConnRef.current && playerConnRef.current.open) {
      playerConnRef.current.send({
        type: 'CHANGE_NAME',
        playerId: pId,
        newName: cleanName,
      } as NetworkMessage);
    }
  };

  // Keep Host signaling connection alive across network changes / mobile wakeups
  useEffect(() => {
    const handleRecheckSignaling = () => {
      if (peerRef.current && peerRef.current.disconnected && !peerRef.current.destroyed) {
        console.log('Reconnecting PeerJS signaling session...');
        try {
          peerRef.current.reconnect();
        } catch {}
      }
    };

    window.addEventListener('online', handleRecheckSignaling);
    document.addEventListener('visibilitychange', handleRecheckSignaling);

    const interval = setInterval(() => {
      if (peerRef.current && peerRef.current.disconnected && !peerRef.current.destroyed) {
        try {
          peerRef.current.reconnect();
        } catch {}
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleRecheckSignaling);
      document.removeEventListener('visibilitychange', handleRecheckSignaling);
      clearInterval(interval);
    };
  }, []);

  // ----------------------------------------------------
  // INITIAL LOAD & AUTO-RESTORE
  // ----------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join') || params.get('room');

    if (joinCode) {
      setRoomCode(sanitizeRoomCode(joinCode));
      setCurrentView('JOIN_FORM');
      return;
    }

    const hostSession = getHostSession();
    if (hostSession && hostSession.roomCode) {
      startHostRoom(
        hostSession.roomCode,
        hostSession.players || [],
        (hostSession.stage as AppView) || 'HOST_LOBBY',
        hostSession.game1State || null
        , hostSession.suiteState || null
      );
      return;
    }

    const playerSession = getPlayerSession();
    if (playerSession && playerSession.roomCode && playerSession.playerName) {
      setRoomCode(playerSession.roomCode);
      setPlayerName(playerSession.playerName);
      setCurrentView('PLAYER_WAITING');
      connectToHostAsPlayer(
        playerSession.roomCode,
        playerSession.playerName,
        playerSession.playerId,
        1
      );
      return;
    }
  }, [startHostRoom, connectToHostAsPlayer]);

  useEffect(() => {
    if (!roomCode || !currentView.startsWith('HOST_')) return;
    saveHostSession({ roomCode, players, stage: currentView, game1State: game1HostState, suiteState: suiteHostState });
  }, [roomCode, players, currentView, game1HostState, suiteHostState]);

  // ----------------------------------------------------
  // VISIBILITY CHANGE LISTENER
  // ----------------------------------------------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const pSession = getPlayerSession();
        if (pSession && (currentViewRef.current === 'PLAYER_WAITING' || currentViewRef.current === 'PLAYER_GAME_SPY' || currentViewRef.current === 'PLAYER_GAME_SUITE')) {
          if (!playerConnRef.current || !playerConnRef.current.open) {
            connectToHostAsPlayer(
              pSession.roomCode,
              pSession.playerName,
              pSession.playerId,
              1
            );
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectToHostAsPlayer]);

  // ----------------------------------------------------
  // GAME 1 LOGIC & ACTIONS (HOST CONTROLLER)
  // ----------------------------------------------------
  const startTheLostSpyGame = () => {
    const activePlayers = players.filter((player) => player.isOnline !== false);
    if (activePlayers.length < LOST_SPY_RULES.minPlayers) {
      alert(`Game 1 (Điệp Viên Lạc Lối) cần ít nhất ${LOST_SPY_RULES.minPlayers} người đang kết nối. Hiện có ${activePlayers.length} người online.`);
      return;
    }

    const wordPair = getRandomWordPair();
    const initialGameState = createGameState(activePlayers, wordPair);

    setGame1HostState(initialGameState);
    setCurrentView('HOST_GAME_SPY');
    broadcastGame1State(initialGameState);
  };

  const handleGame1NextTurn = () => {
    if (!game1HostState) return;

    if (game1HostState.stage === 'MEMORIZE') {
      // Transition to DESCRIBE stage
      const updated: TheLostSpyGameState = {
        ...game1HostState,
        stage: 'DESCRIBE',
        currentTurnIndex: 0,
      };
      setGame1HostState(updated);
      broadcastGame1State(updated);
    } else if (game1HostState.stage === 'DESCRIBE') {
      // Advance speaker turn
      const nextIndex = game1HostState.currentTurnIndex + 1;
      if (nextIndex < game1HostState.turnOrder.length) {
        const updated: TheLostSpyGameState = {
          ...game1HostState,
          currentTurnIndex: nextIndex,
        };
        setGame1HostState(updated);
        broadcastGame1State(updated);
      }
    }
  };

  const handleGame1StartVoting = () => {
    if (!game1HostState) return;
    const updated: TheLostSpyGameState = {
      ...game1HostState,
      stage: 'VOTE',
      votes: {},
    };
    setGame1HostState(updated);
    broadcastGame1State(updated);
  };

  const handleGame1RevealResult = () => {
    if (!game1HostState) return;
    const resolution = resolveVotes(game1HostState);
    if (resolution.status === 'INCOMPLETE' || resolution.status === 'NO_VOTES') return;
    if (resolution.status === 'TIE') {
      const tiedNames = resolution.tiedPlayerIds.map((id) => game1HostState.playerRoles[id]?.name).filter(Boolean).join(', ');
      const updated: TheLostSpyGameState = {
        ...game1HostState,
        votes: {},
        announcement: {
          titleVi: '⚖️ HÒA PHIẾU — BỎ PHIẾU LẠI',
          titleEn: '⚖️ TIED VOTE — VOTE AGAIN',
          messageVi: `${tiedNames} cùng nhận ${resolution.votes} phiếu. Tất cả người còn sống hãy bỏ phiếu lại.`,
          messageEn: `${tiedNames} each received ${resolution.votes} votes. All surviving players must vote again.`,
          type: 'warning',
        },
      };
      setGame1HostState(updated);
      broadcastGame1State(updated);
      return;
    }
    const eliminatedId = resolution.eliminatedId;

    // Mark player as not alive
    const updatedRoles = { ...game1HostState.playerRoles };
    if (updatedRoles[eliminatedId]) {
      updatedRoles[eliminatedId] = {
        ...updatedRoles[eliminatedId],
        isAlive: false,
      };
    }

    // Check Win Conditions
    const winner = determineWinner(updatedRoles);

    // Always show RESULT stage first so players can see who was eliminated
    const updated: TheLostSpyGameState = {
      ...game1HostState,
      stage: 'RESULT',
      eliminatedId,
      playerRoles: updatedRoles,
      winner,
    };

    setGame1HostState(updated);
    broadcastGame1State(updated);
  };

  const handleGame1NextRound = () => {
    if (!game1HostState) return;
    if (game1HostState.winner) {
      const updated: TheLostSpyGameState = {
        ...game1HostState,
        stage: 'GAME_OVER',
      };
      setGame1HostState(updated);
      broadcastGame1State(updated);
      return;
    }

    // Filter alive players for new turn order
    const aliveTurnOrder = getAliveTurnOrder(game1HostState);

    const updated: TheLostSpyGameState = {
      ...game1HostState,
      stage: 'DESCRIBE',
      round: game1HostState.round + 1,
      turnOrder: aliveTurnOrder,
      currentTurnIndex: 0,
      votes: {},
      eliminatedId: null,
    };

    setGame1HostState(updated);
    broadcastGame1State(updated);
  };

  // ----------------------------------------------------
  // PLAYER: VOTE ACTION
  // ----------------------------------------------------
  const handlePlayerVote = (targetId: string) => {
    if (playerConnRef.current && playerConnRef.current.open) {
      const pSession = getPlayerSession();
      if (pSession) {
        playerConnRef.current.send({
          type: 'SPY_VOTE',
          voterId: pSession.playerId,
          targetId,
        } as NetworkMessage);
      }
    }
  };

  const handlePlayerGuessWord = (guess: string) => {
    if (playerConnRef.current && playerConnRef.current.open) {
      const pSession = getPlayerSession();
      if (pSession) {
        playerConnRef.current.send({
          type: 'SPY_GUESS_WORD',
          playerId: pSession.playerId,
          guess,
        } as NetworkMessage);
      }
    }
  };

  const handleGame1GuessWord = (pId: string, guess: string) => {
    if (!game1HostStateRef.current) return;
    const currentState = game1HostStateRef.current;
    const player = currentState.playerRoles[pId];

    if (!player || !player.isAlive) return;

    if (player.role === 'CIVILIAN') {
      // Dân thường tưởng mình là gián điệp rồi đoán -> Bị loại luôn!
      const updatedRoles = { ...currentState.playerRoles };
      updatedRoles[pId] = { ...player, isAlive: false };

      const aliveRoles = Object.values(updatedRoles).filter((p) => p.isAlive);
      const civilianAliveCount = aliveRoles.filter((p) => p.role === 'CIVILIAN').length;
      const spyAlive = aliveRoles.some((p) => p.role === 'SPY');

      let winner = currentState.winner;
      let nextStage = currentState.stage;
      let announcementMsgVi = `Dân thường "${player.name}" tưởng mình là Gián điệp và đã điền đáp án! "${player.name}" BỊ LOẠI NGAY LẬP TỨC!`;
      let announcementMsgEn = `Civilian "${player.name}" thought they were the Spy and submitted a guess! "${player.name}" is ELIMINATED IMMEDIATELY!`;

      if (spyAlive && civilianAliveCount === 1) {
        winner = 'SPY';
        nextStage = 'GAME_OVER';
        announcementMsgVi += ` Chỉ còn lại 1 Dân thường và 1 Gián điệp -> GIÁN ĐIỆP CHIẾN THẮNG!`;
        announcementMsgEn += ` Only 1 Civilian and 1 Spy remain -> THE SPY WINS!`;
      }

      const updated: TheLostSpyGameState = {
        ...currentState,
        playerRoles: updatedRoles,
        stage: nextStage,
        winner,
        announcement: {
          title: '🚨 DÂN THƯỜNG BỊ LOẠI VÌ ĐOÁN TỪ!',
          titleVi: '🚨 DÂN THƯỜNG BỊ LOẠI VÌ ĐOÁN TỪ!',
          titleEn: '🚨 CIVILIAN ELIMINATED FOR GUESSING!',
          message: announcementMsgVi,
          messageVi: announcementMsgVi,
          messageEn: announcementMsgEn,
          type: 'danger',
        },
      };

      setGame1HostState(updated);
      broadcastGame1State(updated);
    } else if (player.role === 'SPY') {
      // Gián điệp đoán từ khóa gốc (tiếng Việt hoặc tiếng Anh)
      const isCorrect = checkGuessMatch(
        guess,
        currentState.wordCivilian,
        currentState.wordCivilianEn
      );

      const wordVi = currentState.wordCivilian;
      const wordEn = currentState.wordCivilianEn;

      if (isCorrect) {
        // Gián điệp đoán đúng -> Thắng luôn!
        const updated: TheLostSpyGameState = {
          ...currentState,
          stage: 'GAME_OVER',
          winner: 'SPY',
          announcement: {
            title: '🎯 GIÁN ĐIỆP ĐÃ ĐOÁN ĐÚNG TỪ KHÓA GỐC!',
            titleVi: '🎯 GIÁN ĐIỆP ĐÃ ĐOÁN ĐÚNG TỪ KHÓA GỐC!',
            titleEn: '🎯 SPY GUESSED SECRET KEYWORD CORRECTLY!',
            message: `Gián điệp "${player.name}" đã đoán chính xác từ khóa gốc là "${wordVi}" (${wordEn})! GIÁN ĐIỆP CHIẾN THẮNG TUYỆT ĐỐI!`,
            messageVi: `Gián điệp "${player.name}" đã đoán chính xác từ khóa gốc là "${wordVi}" (${wordEn})! GIÁN ĐIỆP CHIẾN THẮNG TUYỆT ĐỐI!`,
            messageEn: `Spy "${player.name}" correctly guessed the secret keyword "${wordEn}" (${wordVi})! THE SPY WINS!`,
            type: 'success',
          },
        };
        setGame1HostState(updated);
        broadcastGame1State(updated);
      } else {
        // Gián điệp đoán sai -> Bị loại luôn, Dân thường thắng!
        const updatedRoles = { ...currentState.playerRoles };
        updatedRoles[pId] = { ...player, isAlive: false };

        const updated: TheLostSpyGameState = {
          ...currentState,
          playerRoles: updatedRoles,
          stage: 'GAME_OVER',
          winner: 'CIVILIANS',
          announcement: {
            title: '❌ GIÁN ĐIỆP ĐÃ ĐOÁN SAI TỪ KHÓA GỐC!',
            titleVi: '❌ GIÁN ĐIỆP ĐÃ ĐOÁN SAI TỪ KHÓA GỐC!',
            titleEn: '❌ SPY GUESSED WRONGLY!',
            message: `Gián điệp "${player.name}" đã đoán "${guess}", nhưng từ khóa gốc là "${wordVi}" (${wordEn}). Gián điệp BỊ BẮT! DÂN THƯỜNG CHIẾN THẮNG!`,
            messageVi: `Gián điệp "${player.name}" đã đoán "${guess}", nhưng từ khóa gốc là "${wordVi}" (${wordEn}). Gián điệp BỊ BẮT! DÂN THƯỜNG CHIẾN THẮNG!`,
            messageEn: `Spy "${player.name}" guessed "${guess}", but the secret keyword was "${wordEn}" (${wordVi}). Spy is CAUGHT! CIVILIANS WIN!`,
            type: 'danger',
          },
        };
        setGame1HostState(updated);
        broadcastGame1State(updated);
      }
    }
  };

  // ----------------------------------------------------
  // HOST KICK MEMBER MECHANIC
  // ----------------------------------------------------
  const handleKickPlayer = (targetId: string) => {
    const playerToKick = playersRef.current.find((p) => p.id === targetId);
    if (!playerToKick) return;

    // 1. Send KICKED message to target player and close connection
    const targetConn = hostConnectionsRef.current.get(targetId);
    if (targetConn && targetConn.open) {
      try {
        targetConn.send({ type: 'KICKED', reason: 'HOST_KICKED' } as NetworkMessage);
      } catch (err) {
        console.warn('Failed to send KICKED message:', err);
      }
      setTimeout(() => {
        try {
          targetConn.close();
        } catch {}
      }, 200);
    }
    hostConnectionsRef.current.delete(targetId);

    // 2. Remove player from players list
    const updatedPlayers = playersRef.current.filter((p) => p.id !== targetId);
    setPlayers(updatedPlayers);
    playersRef.current = updatedPlayers;

    // 3. Save host session
    saveHostSession({
      roomCode: roomCodeRef.current,
      players: updatedPlayers,
      stage: currentViewRef.current,
      game1State: game1HostStateRef.current,
      suiteState: suiteHostStateRef.current,
    });

    // 4. If in Lobby, broadcast PLAYERS_UPDATE to remaining players
    if (currentViewRef.current === 'HOST_LOBBY') {
      hostConnectionsRef.current.forEach((conn) => {
        try {
          conn.send({
            type: 'PLAYERS_UPDATE',
            players: updatedPlayers,
          } as NetworkMessage);
        } catch {}
      });
    }

    // 5. If currently in Game 1 (The Lost Spy)
    if (game1HostStateRef.current && currentViewRef.current === 'HOST_GAME_SPY') {
      handleGame1PlayerKicked(targetId, playerToKick.name);
    }
  };

  const handleGame1PlayerKicked = (targetId: string, playerName: string) => {
    const currentState = game1HostStateRef.current;
    if (!currentState) return;

    const playerRole = currentState.playerRoles[targetId];
    const updatedRoles = { ...currentState.playerRoles };
    if (playerRole) {
      updatedRoles[targetId] = { ...playerRole, isAlive: false };
    }

    // Remove from turn order
    const updatedTurnOrder = currentState.turnOrder.filter((id) => id !== targetId);
    let newTurnIndex = currentState.currentTurnIndex;
    if (newTurnIndex >= updatedTurnOrder.length) {
      newTurnIndex = Math.max(0, updatedTurnOrder.length - 1);
    }

    // Remove votes involving this player
    const updatedVotes = { ...currentState.votes };
    delete updatedVotes[targetId];
    for (const [voter, target] of Object.entries(updatedVotes)) {
      if (target === targetId) {
        delete updatedVotes[voter];
      }
    }

    // Recalculate alive players and win conditions
    const aliveRoles = Object.values(updatedRoles).filter((p) => p.isAlive);
    const spyAlive = aliveRoles.some((p) => p.role === 'SPY');
    const civilianAliveCount = aliveRoles.filter((p) => p.role === 'CIVILIAN').length;

    let winner = currentState.winner;
    let nextStage = currentState.stage;

    let annTitleVi = '⚠️ NGƯỜI CHƠI BỊ ĐUỔI KHỎI PHÒNG';
    let annTitleEn = '⚠️ PLAYER KICKED FROM ROOM';
    let annMsgVi = `Host đã đuổi người chơi "${playerName}" khỏi phòng.`;
    let annMsgEn = `Host kicked player "${playerName}" from the room.`;

    if (!spyAlive && currentState.stage !== 'GAME_OVER') {
      // Spy was kicked -> Civilians win immediately!
      winner = 'CIVILIANS';
      nextStage = 'GAME_OVER';
      annTitleVi = '🏆 DÂN THƯỜNG CHIẾN THẮNG!';
      annTitleEn = '🏆 CIVILIANS WIN!';
      annMsgVi += ` Gián điệp đã bị loại khỏi phòng -> DÂN THƯỜNG CHIẾN THẮNG!`;
      annMsgEn += ` The Spy was removed from the room -> CIVILIANS WIN!`;
    } else if (spyAlive && civilianAliveCount <= 1 && currentState.stage !== 'GAME_OVER') {
      // 1 Spy and 1 or 0 civilian remain -> Spy wins!
      winner = 'SPY';
      nextStage = 'GAME_OVER';
      annTitleVi = '🏆 GIÁN ĐIỆP CHIẾN THẮNG!';
      annTitleEn = '🏆 THE SPY WINS!';
      annMsgVi += ` Chỉ còn lại ${civilianAliveCount} Dân thường và 1 Gián điệp -> GIÁN ĐIỆP CHIẾN THẮNG!`;
      annMsgEn += ` Only ${civilianAliveCount} Civilian and 1 Spy remain -> THE SPY WINS!`;
    }

    const updatedState: TheLostSpyGameState = {
      ...currentState,
      playerRoles: updatedRoles,
      turnOrder: updatedTurnOrder,
      currentTurnIndex: newTurnIndex,
      votes: updatedVotes,
      stage: nextStage,
      winner,
      announcement: {
        title: annTitleVi,
        message: annMsgVi,
        titleVi: annTitleVi,
        titleEn: annTitleEn,
        messageVi: annMsgVi,
        messageEn: annMsgEn,
        type: 'warning',
      },
    };

    setGame1HostState(updatedState);
    broadcastGame1State(updatedState);
  };

  // ----------------------------------------------------
  // NAVIGATION & STAGE TRANSITIONS
  // ----------------------------------------------------
  const handleStartFromLobby = () => {
    setCurrentView('HOST_GAME_SELECT');
    saveHostSession({
      roomCode: roomCodeRef.current,
      players: playersRef.current,
      stage: 'HOST_GAME_SELECT',
      game1State: null,
      suiteState: null,
    });
  };

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'the-lost-spy') {
      startTheLostSpyGame();
      return;
    }
    const activePlayers = playersRef.current.filter((player) => player.isOnline !== false);
    if (activePlayers.length < LOST_SPY_RULES.minPlayers) {
      alert(lang === 'vi' ? `Cần ít nhất 4 người đang kết nối. Hiện có ${activePlayers.length}.` : `At least 4 connected players are required. Currently ${activePlayers.length}.`);
      return;
    }
    const initial = createSuiteGame(gameId as SuiteGameId, activePlayers);
    setSuiteHostState(initial);
    suiteHostStateRef.current = initial;
    setCurrentView('HOST_GAME_SUITE');
    broadcastSuiteState(initial);
  };

  const handleSuiteNext = () => {
    if (!suiteHostStateRef.current) return;
    const updated = nextSuiteRound(suiteHostStateRef.current);
    setSuiteHostState(updated); suiteHostStateRef.current = updated; broadcastSuiteState(updated);
  };
  const handleSuiteReplay = () => {
    if (!suiteHostStateRef.current) return;
    const updated = createSuiteGame(suiteHostStateRef.current.gameId, suiteHostStateRef.current.players);
    setSuiteHostState(updated); suiteHostStateRef.current = updated; broadcastSuiteState(updated);
  };
  const handleSuitePlayerAction = (action: SuiteAction) => {
    const pSession = getPlayerSession();
    if (pSession && playerConnRef.current?.open) playerConnRef.current.send({ type: 'SUITE_ACTION', playerId: pSession.playerId, action } as NetworkMessage);
  };

  const handleBackToLobby = () => {
    // Notify all players that game has stopped and host is back to lobby
    hostConnectionsRef.current.forEach((conn) => {
      try {
        conn.send({
          type: 'HOST_STAGE_CHANGE',
          stage: 'WAITING',
        } as NetworkMessage);
      } catch {}
    });

    setGame1HostState(null);
    setSuiteHostState(null);
    setCurrentView('HOST_LOBBY');
    saveHostSession({
      roomCode: roomCodeRef.current,
      players: playersRef.current,
      stage: 'HOST_LOBBY',
      game1State: null,
      suiteState: null,
    });
  };

  const handleCloseHostRoom = () => {
    hostConnectionsRef.current.forEach((conn) => {
      try {
        conn.send({ type: 'ROOM_CLOSED' } as NetworkMessage);
      } catch {}
    });

    clearHostSession();
    cleanupPeer();
    setRoomCode('');
    setPlayers([]);
    setGame1HostState(null);
    setSuiteHostState(null);
    setCurrentView('HOME');
  };

  const handleLeavePlayerRoom = () => {
    clearPlayerSession();
    cleanupPeer();
    setRoomCode('');
    setPlayerName('');
    setGame1ClientState(null);
    setSuiteClientState(null);
    setCurrentView('HOME');
  };

  // ----------------------------------------------------
  // RENDER CURRENT VIEW
  // ----------------------------------------------------
  switch (currentView) {
    case 'HOME':
      return (
        <HomeView
          lang={lang}
          onToggleLang={handleToggleLang}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={() => {
            setErrorMessage('');
            setCurrentView('JOIN_FORM');
          }}
        />
      );

    case 'HOST_LOBBY':
      return (
        <HostLobbyView
          lang={lang}
          onToggleLang={handleToggleLang}
          roomCode={roomCode}
          players={players}
          onStart={handleStartFromLobby}
          onCloseRoom={handleCloseHostRoom}
          onKickPlayer={handleKickPlayer}
        />
      );

    case 'HOST_GAME_SELECT':
      return (
        <HostGameSelectView
          lang={lang}
          onToggleLang={handleToggleLang}
          players={players}
          onSelectGame={handleSelectGame}
          onBackToLobby={handleBackToLobby}
        />
      );

    case 'HOST_GAME_SPY':
      return game1HostState ? (
        <HostTheLostSpy
          key={`${game1HostState.round}-${game1HostState.stage}`}
          lang={lang}
          onToggleLang={handleToggleLang}
          gameState={game1HostState}
          onNextTurn={handleGame1NextTurn}
          onStartVoting={handleGame1StartVoting}
          onRevealResult={handleGame1RevealResult}
          onNextRound={handleGame1NextRound}
          onPlayAgain={startTheLostSpyGame}
          onExitGame={handleBackToLobby}
          onKickPlayer={handleKickPlayer}
        />
      ) : null;

    case 'HOST_GAME_SUITE':
      return suiteHostState ? (
        <HostSuiteGame state={suiteHostState} lang={lang} onToggleLang={handleToggleLang} onNext={handleSuiteNext} onReplay={handleSuiteReplay} onExit={handleBackToLobby} />
      ) : null;

    case 'JOIN_FORM':
      return (
        <JoinView
          lang={lang}
          onToggleLang={handleToggleLang}
          initialRoomCode={roomCode}
          onJoin={handleJoinRoom}
          onBack={handleLeavePlayerRoom}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      );

    case 'PLAYER_WAITING':
      return (
        <PlayerWaitingView
          lang={lang}
          onToggleLang={handleToggleLang}
          roomCode={roomCode}
          playerName={playerName}
          isReconnecting={isReconnecting}
          reconnectAttempt={reconnectAttempt}
          onLeaveRoom={handleLeavePlayerRoom}
          onChangeName={handleChangePlayerName}
        />
      );

    case 'PLAYER_GAME_SPY':
      return game1ClientState ? (
        <PlayerTheLostSpy
          key={`${game1ClientState.round}-${game1ClientState.stage}`}
          lang={lang}
          onToggleLang={handleToggleLang}
          clientState={game1ClientState}
          playerName={playerName}
          onVote={handlePlayerVote}
          onGuessWord={handlePlayerGuessWord}
          onChangeName={handleChangePlayerName}
        />
      ) : null;

    case 'PLAYER_GAME_SUITE':
      return suiteClientState ? (
        <PlayerSuiteGame
          state={suiteClientState}
          lang={lang}
          onToggleLang={handleToggleLang}
          onAction={handleSuitePlayerAction}
          onChangeName={handleChangePlayerName}
        />
      ) : null;

    default:
      return null;
  }
};
