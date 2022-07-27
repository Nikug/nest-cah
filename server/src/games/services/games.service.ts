import { Injectable } from '@nestjs/common';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { GamesFactory } from '../factories/games.factory';
import { Game } from '../schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gamesFactory: GamesFactory,
  ) {}

  createGame(): Promise<Game> {
    const game = this.gamesFactory.createGame();
    const newGame = this.gamesRepository.create(game);
    return newGame;
  }
}
