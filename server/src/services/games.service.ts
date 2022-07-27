import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(): Promise<Game> {
    const newGame = new this.gameModel();
    return newGame.save();
  }

  async isCardCzar(gameId: string, playerId: string): Promise<boolean | null> {
    return this.gameModel.findOne(
      { _id: gameId, 'players._id': playerId },
      'players.$.isCardCzar',
    );
  }

  async isHost(gameId: string, playerId: string): Promise<boolean | null> {
    return this.gameModel.findOne(
      { _id: gameId, 'players._id': playerId },
      'players.$.isHost',
    );
  }
}
