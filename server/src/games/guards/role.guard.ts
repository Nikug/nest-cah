import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GamesRepository } from 'src/database/repositories/games.repository';
import { PlayerRole } from '../interfaces/games.interfaces';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private gamesRepository: GamesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<PlayerRole>('role', context.getHandler());
    if (!role) return true;

    const request = context.switchToHttp().getRequest();
    const gameName: string = request.params.gameName;
    const playerId: string = request.params.playerId;

    if (role === 'cardCzar') {
      return await this.gamesRepository.isCardCzar(gameName, playerId);
    } else if (role === 'host') {
      return await this.gamesRepository.isHost(gameName, playerId);
    }

    return true;
  }
}
