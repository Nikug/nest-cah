import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { Game, GameSchema } from 'src/games/schemas/game.schema';
import { GamesFactory } from './factories/games.factory';
import { GamesController } from './games.controller';
import { GamesGateway } from './gateways/games.gateway';
import { GamesService } from './services/games.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GamesController],
  providers: [GamesRepository, GamesService, GamesFactory, GamesGateway],
})
export class GamesModule {}
