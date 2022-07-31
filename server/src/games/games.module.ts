import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GamesFactory } from './factories/games.factory';
import { GamesController } from './games.controller';
import { GamesGateway } from './gateways/games.gateway';
import { GamesService } from './services/games.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GamesController],
  providers: [GamesService, GamesFactory, GamesGateway],
})
export class GamesModule {}
