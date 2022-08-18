import { GameDocument } from 'src/database/schemas/game.schema';
import { Player } from 'src/database/schemas/player.schema';
import {
  ActivePlayerStates,
  InactivePlayerStates,
} from '../consts/games.consts';
import { PlayerState } from '../interfaces/games.interfaces';

export const setActivePlayersToState = (
  game: GameDocument,
  state: PlayerState,
): GameDocument => {
  const players = game.players.map((player) => {
    if (playerIsActive(player)) {
      player.state = state;
    }
    return player;
  });

  game.players = players;
  return game;
};

export const setJoiningPlayersReady = (game: GameDocument): GameDocument => {
  const players = game.players.map((player) => {
    if (playerIsJoining(player)) {
      player.state = 'ready';
    }
    return player;
  });

  game.players = players;
  return game;
};

export const playerIsActive = (player: Player): boolean => {
  return ActivePlayerStates.includes(player.state);
};

export const playerIsInactive = (player: Player): boolean => {
  return InactivePlayerStates.includes(player.state);
};

export const playerIsJoining = (player: Player): boolean => {
  return player.state === 'joining';
};

export const playerIsConnected = (player: Player): boolean => {
  return player.state !== 'disconnected' && player.state !== 'left';
};
