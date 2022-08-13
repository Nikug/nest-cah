import { GameDocument } from 'src/database/schemas/game.schema';
import { randomBetween } from './math.helper';

export const getCurrentCardCzar = (game: GameDocument): string | undefined => {
  return game.players.find((player) => player.isCardCzar)?.id;
};

export const getPreviousCardCzar = (game: GameDocument): string | undefined => {
  const lastRound = game.rounds.at(-1);
  return lastRound?.cardCzarId;
};

export const getPreviousWinner = (game: GameDocument): string | undefined => {
  const lastRound = game.rounds.at(-1);
  if (!lastRound) return undefined;
  const lastWinner = lastRound.playedCards.find((cards) => cards.winner);
  return lastWinner?.playerId;
};

export const getNextCardCzar = (game: GameDocument): string => {
  if (game.options.winnerBecomesCardCzar) {
    const previousWinner = getPreviousWinner(game);
    if (previousWinner) return previousWinner;
  } else {
    const previousCardCzar = getPreviousCardCzar(game);
    if (previousCardCzar) {
      const previousCardCzarIndex = game.players.findIndex(
        (player) => player.id === previousCardCzar,
      );
      if (previousCardCzarIndex === game.players.length - 1) {
        return game.players[0].id;
      } else {
        return game.players[previousCardCzarIndex + 1].id;
      }
    }
  }

  const randomPlayer = game.players[randomBetween(0, game.players.length - 1)];
  return randomPlayer.id;
};

export const setNextCardCzar = (game: GameDocument): GameDocument => {
  const nextCardCzar = getNextCardCzar(game);
  game.players = game.players.map((player) =>
    player.id === nextCardCzar
      ? { ...player, isCardCzar: true }
      : { ...player, isCardCzar: false },
  );

  return game;
};
