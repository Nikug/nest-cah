import { Injectable } from '@nestjs/common';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { GamesFactory } from '../factories/games.factory';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gamesFactory: GamesFactory,
  ) {}

  createGame(): string {
    const game = this.gamesFactory.createGame();
    this.gamesRepository.create(game);
    return game.name;
  }
}
