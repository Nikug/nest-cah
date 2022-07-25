import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GameState } from 'src/types/types';
import { CardDeck, CardDeckSchema } from './cardDeck.schema';
import { Player, PlayerSchema } from './player.schema';

export type GameDocument = Document & Game;

@Schema()
export class Game {
  @Prop({ required: true })
  state: GameState;

  @Prop({ required: true, type: PlayerSchema })
  players: Player[];

  @Prop({ required: true, type: CardDeckSchema })
  cards: CardDeck;

  // fix
  @Prop({ required: true })
  options: string[];

  // fix
  @Prop({ required: true })
  timers: string[];

  // fix
  @Prop({ required: true })
  streak: number;

  // fix
  @Prop({ required: true })
  currentRound: number;

  // fix
  @Prop({ required: true })
  rounds: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);
