import { SetMetadata } from '@nestjs/common';
import { PlayerRole } from 'src/types/types';

export const Role = (role: PlayerRole) => SetMetadata('role', role);
