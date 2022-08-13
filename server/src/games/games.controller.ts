import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Operation } from 'fast-json-patch';
import { Role } from 'src/games/decorators/roles.decorator';
import { RoleGuard } from 'src/games/guards/role.guard';
import { SocketMessages } from './consts/sockets.consts';
import { GamesGateway } from './gateways/games.gateway';
import { RouteParams } from './interfaces/games.interfaces';
import { GamesService } from './services/games.service';

@Controller('games')
@UseGuards(RoleGuard)
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private gamesGateway: GamesGateway,
  ) {}
  @Get('ping')
  async ping(): Promise<string> {
    return 'Pong!';
  }

  @Post()
  async createGame(): Promise<string> {
    const game = await this.gamesService.createGame();
    return `created the game ${game.name}`;
  }

  @Post('join/:gameName/:playerId?')
  async joinGame(
    @Param('gameName') gameName: string,
    @Param('playerId') playerId?: string,
  ): Promise<RouteParams> {
    const result = await this.gamesService.joinGame(gameName, playerId);
    return result;
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

    await this.gamesGateway.updateOtherPlayers(
      params.gameName,
      params.playerId,
      SocketMessages.options,
      newPatch,
    );

    return newPatch;
  }

  @Post('options/:gameName/:playerId')
  @Role('host')
  async startGame(@Param() params: RouteParams): Promise<void> {
    await this.gamesService.startGame(params.gameName);
  }
}
