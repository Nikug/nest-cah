import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { PlayerRole } from '../interfaces/games.interfaces';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private gamesService: GamesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<PlayerRole>('role', context.getHandler());
    if (!role) return true;

    const request = context.switchToHttp().getRequest();
    const gameId: string = request.gameId;
    const playerId: string = request.playerId;

    if (role === 'cardCzar') {
      return !!(await this.gamesService.isCardCzar(gameId, playerId));
    } else if (role === 'host') {
      return !!(await this.gamesService.isHost(gameId, playerId));
    }

    return true;
  }
}
