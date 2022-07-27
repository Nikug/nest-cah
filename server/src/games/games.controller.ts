import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/games/decorators/roles.decorator';
import { RoleGuard } from 'src/games/guards/role.guard';
import { RouteParams } from './interfaces/games.interfaces';
import { GamesService } from './services/games.service';

@Controller('games')
@UseGuards(RoleGuard)
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  createGame(): string {
    const result = this.gamesService.createGame();
    return `created the game ${result}`;
  }

  @Post(':gameId')
  joinGame(@Param('gameId') gameId: string): string {
    // do stuff
    return 'joined the game';
  }

  @Post(':gameId/:playerId')
  @Role('host')
  updateOptions(@Param() params: RouteParams, @Body() options: any): string {
    // do stuff
    return 'updated options';
  }
}
