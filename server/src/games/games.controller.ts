import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Operation } from 'fast-json-patch';
import { Role } from 'src/games/decorators/roles.decorator';
import { RoleGuard } from 'src/games/guards/role.guard';
import { RouteParams } from './interfaces/games.interfaces';
import { GamesService } from './services/games.service';

@Controller('games')
@UseGuards(RoleGuard)
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  async createGame(): Promise<string> {
    const game = await this.gamesService.createGame();
    return `created the game ${game.name}`;
  }

  @Post('join/:gameName/:playerId?')
  async joinGame(
    @Param('gameName') gameName: string,
    @Param('playerId') playerId?: string,
  ): Promise<string> {
    const game = await this.gamesService.joinGame(gameName, playerId);
    return `joined the game ${game.name} with player id ${game.players[0]?._id}`;
  }

  @Post('options/:gameName/:playerId')
  @Role('host')
  async updateOptions(
    @Param() params: RouteParams,
    @Body() patch: Operation[],
  ): Promise<Operation[]> {
    const newPatch = await this.gamesService.updateGameOptions(
      params.gameName,
      patch,
    );
    return newPatch;
  }
}
