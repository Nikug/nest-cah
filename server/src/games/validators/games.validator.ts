import { Game } from 'src/database/schemas/game.schema';
import { GameOptionsConfig } from '../consts/games.consts';
import { playerIsActive } from '../helpers/playerState.helper';

export const validatePlayerCount = (game: Game): boolean => {
  const playerCount = game.players.filter(playerIsActive);
  return playerCount.length >= GameOptionsConfig.maximumPlayers.min;
};

export const validateCardCount = (game: Game): boolean => {
  const whiteCardCount = game.cards.whiteCards.length;
  const blackCardCount = game.cards.blackCards.length;

  const playerCount = game.players.filter(playerIsActive).length;

  const minimumWhiteCardCount = game.options.numberOfWhiteCards * playerCount;
  const minimumBlackCardCount = game.options.numberOfBlackCards * playerCount;

  return (
    whiteCardCount >= minimumWhiteCardCount &&
    blackCardCount >= minimumBlackCardCount
  );
};
