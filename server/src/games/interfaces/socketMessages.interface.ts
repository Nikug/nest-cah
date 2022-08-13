import { Operation } from 'fast-json-patch';
import { BlackCard } from 'src/database/schemas/blackCard.schema';
import {
  ConfidentialPlayerDto,
  GameDto,
  PlayerDto,
} from './gameDtos.interfaces';

export interface SubscribeGameMessage {
  gameName: string;
  playerId: string;
}

export interface FullGameMessage {
  game: GameDto;
  players: PlayerDto[];
  player: ConfidentialPlayerDto;
  blackCards?: BlackCard[];
}

export interface GameUpdateMessage {
  game: Operation[];
  players: Operation[];
  player: Operation[];
  blackCards?: BlackCard[];
}
