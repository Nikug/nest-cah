import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/database/schemas/game.schema';
import { Player } from '../schemas/player.schema';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(game: Game): Promise<Game> {
    const newGame = new this.gameModel(game);
    const savedGame = await newGame.save();
    return savedGame.toObject();
  }

  async getGame(gameName: string): Promise<GameDocument | null> {
    const game = await this.gameModel.findOne().where('name').equals(gameName);
    return game;
  }

  async getPlayer(
    gameName: string,
    playerId: string,
  ): Promise<Player | undefined> {
    const game = await this.gameModel
      .findOne()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .select('players.$');
    console.log(game);
    return game?.players?.[0];
  }

  async isCardCzar(gameName: string, playerId: string): Promise<boolean> {
    const game = await this.gameModel
      .findOne()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .select('players.isCardCzar.$');

    if (game?.players.length === 1) {
      return game.players[0].isCardCzar;
    }
    return false;
  }

  async isHost(gameName: string, playerId: string): Promise<boolean> {
    const game = await this.gameModel
      .findOne()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .select('players.isHost.$');

    if (game?.players.length === 1) {
      return game.players[0].isHost;
    }
    return false;
  }

  async gameHasHost(gameName: string): Promise<boolean> {
    const isHost = await this.gameModel
      .findOne<boolean>()
      .where('name')
      .equals(gameName)
      .where('players.isHost')
      .equals(true)
      .select('players.isHost');
    return isHost !== null;
  }

  async gameExists(gameName: string): Promise<boolean> {
    return !!(await this.gameModel.exists({ name: gameName }));
  }

  async addPlayer(
    gameName: string,
    newPlayer: Player,
  ): Promise<Game | undefined> {
    const update = await this.gameModel.findOneAndUpdate(
      { name: gameName },
      {
        $push: { players: newPlayer },
      },
      { returnDocument: 'after' },
    );

    return update?.toObject();
  }

  async setPlayerSocket(
    gameName: string,
    playerId: string,
    socketId: string,
  ): Promise<number> {
    const result = await this.gameModel
      .updateOne()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .set('socketId', socketId);
    return result.modifiedCount;
  }
}
