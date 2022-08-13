import { compare } from 'fast-json-patch';
import { Game } from 'src/database/schemas/game.schema';
import { PlayedCards } from 'src/database/schemas/playedCards.schema';
import { Player } from 'src/database/schemas/player.schema';
import { Round } from 'src/database/schemas/round.schema';
import { Streak } from 'src/database/schemas/streak.schema';
import { PlayerNotFoundError } from '../consts/errors.consts';
import {
  ConfidentialPlayerDto,
  GameDto,
  PlayedCardsDto,
  PlayerDto,
  RoundDto,
  StreakDto,
} from '../interfaces/gameDtos.interfaces';
import { PlayerIdMap } from '../interfaces/games.interfaces';
import {
  FullGameMessage,
  GameUpdateMessage,
} from '../interfaces/socketMessages.interface';

// TODO: Map message for every player individually
export const mapFullGameUpdate = (
  game: Game,
  playerId: string,
): FullGameMessage => {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new PlayerNotFoundError(playerId);

  const mappedGame = mapGame(game);
  const mappedPlayers = mapPlayers(game.players);
  const mappedPlayer = mapConfidentialPlayer(player);

  return {
    game: mappedGame,
    players: mappedPlayers,
    player: mappedPlayer,
  };
};

// TODO: Map message for every player individually
export const mapPatchGameUpdate = (
  originalGame: Game,
  updatedGame: Game,
  playerId: string,
): GameUpdateMessage => {
  const original = mapFullGameUpdate(originalGame, playerId);
  const updated = mapFullGameUpdate(updatedGame, playerId);

  const gamePatch = compare(original.game, updated.game);
  const playersPatch = compare(original.players, updated.players);
  const playerPatch = compare(original.player, updated.player);

  return {
    game: gamePatch,
    players: playersPatch,
    player: playerPatch,
  };
};

export const mapGame = (game: Game): GameDto => {
  const playerIds = mapPlayerIds(game.players);
  return {
    name: game.name,
    state: game.state,
    options: game.options,
    streak: mapStreak(game.streak, playerIds),
    rounds: game.rounds.map((round) => mapRound(round, playerIds)),
  };
};

export const mapPlayers = (players: Player[]): PlayerDto[] => {
  return players.map(mapPlayer);
};

export const mapPlayer = (player: Player): PlayerDto => {
  return {
    id: player.publicId,
    name: player.name,
    state: player.state,
    score: player.score,
    avatar: player.avatar,
    isCardCzar: player.isCardCzar,
    isHost: player.isHost,
    isPopularVoteKing: player.isPopularVoteKing,
  };
};

export const mapConfidentialPlayer = (
  player: Player,
): ConfidentialPlayerDto => {
  return {
    id: player.publicId,
    privateId: player.id,
    socketId: player.socketId,
    name: player.name,
    state: player.state,
    score: player.score,
    avatar: player.avatar,
    isCardCzar: player.isCardCzar,
    isHost: player.isHost,
    isPopularVoteKing: player.isPopularVoteKing,
    whiteCards: player.whiteCards,
  };
};

export const mapPlayedCards = (playedCards: PlayedCards): PlayedCardsDto => {
  return {
    popularVotes: playedCards.popularVotes.length,
    winner: playedCards.winner,
    whiteCards: playedCards.whiteCards,
  };
};

export const mapStreak = (
  streak: Streak | undefined,
  playerIds: PlayerIdMap,
): StreakDto | undefined => {
  if (!streak) return undefined;
  return {
    playerId: playerIds[streak.playerId],
    wins: streak.wins,
  };
};

export const mapPlayerIds = (players: Player[]): PlayerIdMap => {
  return players.reduce((playerIdMap, player) => {
    playerIdMap[player.id] = player.publicId;
    return playerIdMap;
  }, {} as PlayerIdMap);
};

export const mapRound = (round: Round, playerIds: PlayerIdMap): RoundDto => {
  const winner = round.playedCards.find((playedCards) => playedCards.winner);
  return {
    round: round.round,
    cardIndex: round.cardIndex,
    blackCard: round.blackCard,
    cardCzarId: playerIds[round.cardCzarId],
    winnerId: winner ? playerIds[winner.playerId] : null,
    playedCards: round.playedCards.map(mapPlayedCards),
  };
};
