import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Game,
  GameDocument,
  GameDocumentFull,
} from 'src/games/schemas/game.schema';
import { Player } from '../schemas/player.schema';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(game: Game): Promise<GameDocument | null> {
    const newGame = new this.gameModel(game);
    return await newGame.save();
  }

  async isCardCzar(
    gameName: string,
    playerId: string,
  ): Promise<boolean | null> {
    return await this.gameModel
      .findOne<boolean>()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .select('players.cardCzar');
  }

  async isHost(gameName: string, playerId: string): Promise<boolean | null> {
    return await this.gameModel
      .findOne<boolean>()
      .where('name')
      .equals(gameName)
      .where('players._id')
      .equals(playerId)
      .select('players.isHost');
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
  ): Promise<GameDocumentFull | null> {
    return await this.gameModel.findOneAndUpdate(
      { name: gameName },
      {
        $push: { players: newPlayer },
      },
      { returnDocument: 'after' },
    );
  }
}
