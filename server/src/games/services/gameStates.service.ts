import { Injectable } from '@nestjs/common';
import { GameDocument } from 'src/database/schemas/game.schema';
import {
  IncorrectGameStateError,
  NotEnoughCardsError,
  NotEnoughPlayersError,
  PlayerNotFoundError,
} from '../consts/errors.consts';
import { GamesFactory } from '../factories/games.factory';
import {
  getCurrentCardCzar,
  setNextCardCzar,
} from '../helpers/cardCzar.helper';
import {
  setActivePlayersToState,
  setJoiningPlayersReady,
} from '../helpers/playerState.helper';
import {
  validateCardCount,
  validatePlayerCount,
} from '../validators/games.validator';
import { CardsService } from './cards.service';

@Injectable()
export class GameStatesService {
  constructor(
    private cardsService: CardsService,
    private gamesFactory: GamesFactory,
  ) {}

  async startGame(game: GameDocument): Promise<GameDocument> {
    if (!validatePlayerCount(game)) {
      throw new NotEnoughPlayersError();
    }
    if (game.state !== 'lobby') {
      throw new IncorrectGameStateError(game.name, game.state, 'start game');
    }
    if (validateCardCount(game)) {
      throw new NotEnoughCardsError(game.name);
    }

    game.state = 'selectingBlackCard';
    game = setActivePlayersToState(game, 'ready');
    return game;
  }

  async startRound(game: GameDocument): Promise<GameDocument> {
    game = setJoiningPlayersReady(game);
    game = this.cardsService.dealWhiteCards(game);

    game = setNextCardCzar(game);
    const cardCzarId = getCurrentCardCzar(game);
    if (!cardCzarId) {
      throw new PlayerNotFoundError('', 'New card czar was not found');
    }

    const newRound = this.gamesFactory.createRound(
      game.rounds.length + 1,
      cardCzarId,
    );
    game.rounds.push(newRound);
    game.state = 'selectingBlackCard';

    return game;
  }
}
