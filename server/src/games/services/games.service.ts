import { Injectable } from '@nestjs/common';
import { applyPatch, compare, Operation } from 'fast-json-patch';
import { GamesRepository } from 'src/database/repositories/games.repository';
import {
  GameNotFoundError,
  PlayerNotFoundError,
} from '../consts/errors.consts';
import { GamesFactory } from '../factories/games.factory';
import { GameNameAndPlayerId } from '../interfaces/gameDtos.interfaces';
import { Game } from '../../database/schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gamesFactory: GamesFactory,
  ) {}

  async createGame(): Promise<Game> {
    const game = this.gamesFactory.createGame();
    const newGame = await this.gamesRepository.create(game);
    if (!newGame) throw new Error('Failed to create the game');

    return newGame;
  }

  async joinGame(
    gameName: string,
    playerId: string | undefined,
  ): Promise<GameNameAndPlayerId> {
    const gameExists = await this.gamesRepository.gameExists(gameName);
    if (!gameExists) throw new GameNotFoundError(gameName);

    const hasHost = await this.gamesRepository.gameHasHost(gameName);
    const player = this.gamesFactory.createPlayer(!hasHost);

    const game = await this.gamesRepository.addPlayer(gameName, player);

    const newPlayerId = game?.players.at(-1)?.id;
    if (!newPlayerId) throw new PlayerNotFoundError(newPlayerId ?? '');

    return { gameName, playerId: newPlayerId };
  }

  async setPlayerSocket(
    gameName: string,
    playerId: string,
    socketId: string,
  ): Promise<void> {
    await this.gamesRepository.setPlayerSocket(gameName, playerId, socketId);
  }

  async getPlayerSocket(
    gameName: string,
    playerId: string,
  ): Promise<string | undefined> {
    const player = await this.gamesRepository.getPlayer(gameName, playerId);
    return player?.socketId;
  }

  async updateGameOptions(
    gameName: string,
    patch: Operation[],
  ): Promise<Operation[]> {
    const game = await this.gamesRepository.getGame(gameName);
    if (!game) throw new GameNotFoundError(gameName);

    const gameBeforePatch = game.toObject<Game>();
    game.options = applyPatch(game.options, patch).newDocument;
    await game.save();

    const gameAfterPatch = game.toObject<Game>();
    const actualPatch = compare(
      gameBeforePatch.options,
      gameAfterPatch.options,
    );

    return actualPatch;
  }
}
