import { SetMetadata } from '@nestjs/common';
import { PlayerRole } from '../interfaces/games.interfaces';

export const Role = (role: PlayerRole) => SetMetadata('role', role);
