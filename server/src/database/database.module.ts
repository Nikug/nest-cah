import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { GamesRepository } from './repositories/games.repository';

@Module({
  imports: [DatabaseConnectionModule],
  providers: [GamesRepository],
  exports: [GamesRepository],
})
export class DatabaseModule {}
