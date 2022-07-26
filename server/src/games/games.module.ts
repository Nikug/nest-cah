import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GamesFactory } from './factories/games.factory';
import { GamesController } from './games.controller';
import { GamesGateway } from './gateways/games.gateway';
import { CardsService } from './services/cards.service';
import { GamesService } from './services/games.service';
import { GameStatesService } from './services/gameStates.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    GameStatesService,
    CardsService,
    GamesFactory,
    GamesGateway,
  ],
  exports: [GamesService],
})
export class GamesModule {}
