import { Injectable } from '@nestjs/common';
import {
  applyPatch,
  compare,
  JsonPatchError,
  Operation,
} from 'fast-json-patch';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { GameNotFoundError } from '../consts/errors.consts';
import { GamesFactory } from '../factories/games.factory';
import { GameDocument, GameDocumentFull } from '../schemas/game.schema';
import { Options, OptionsSchema } from '../schemas/options.schema';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gamesFactory: GamesFactory,
  ) {}

  async createGame(): Promise<GameDocument> {
    const game = this.gamesFactory.createGame();
    const newGame = await this.gamesRepository.create(game);
    if (!newGame) throw new Error('Failed to create the game');

    return newGame;
  }

  async joinGame(
    gameName: string,
    playerId: string | undefined,
  ): Promise<GameDocumentFull> {
    const gameExists = await this.gamesRepository.gameExists(gameName);
    if (!gameExists) throw new GameNotFoundError(gameName);

    const hasHost = await this.gamesRepository.gameHasHost(gameName);
    const player = this.gamesFactory.createPlayer('aaa', !hasHost);

    const game = await this.gamesRepository.addPlayer(gameName, player);
    if (!game) throw new GameNotFoundError(gameName);

    return game;
  }

  async updateGameOptions(gameName: string, patch: Operation[]): Promise<void> {
    const game = await this.gamesRepository.getGame(gameName);
    if (!game) throw new GameNotFoundError(gameName);

    game.options = applyPatch(game.options, patch).newDocument;
    await game.save();
  }
}
