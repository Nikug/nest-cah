import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/games/schemas/game.schema';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(game: Game): Promise<Game> {
    const newGame = new this.gameModel(game);
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
