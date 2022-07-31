import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GameState } from '../interfaces/games.interfaces';
import { CardDeck } from './cardDeck.schema';
import { Options, OptionsSchema } from './options.schema';
import { Player, PlayerSchema } from './player.schema';
import { Round, RoundSchema } from './round.schema';
import { Streak, StreakSchema } from './streak.schema';

export type GameDocument = Document & Game;

@Schema()
export class Game {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  state: GameState;

  @Prop({ required: true, type: [PlayerSchema] })
  players: Player[];

  @Prop({ type: Types.ObjectId, ref: CardDeck.name })
  cards: CardDeck;

  @Prop({ required: true, type: OptionsSchema })
  options: Options;

  @Prop({ type: StreakSchema })
  streak?: Streak;

  @Prop({ required: true, type: [RoundSchema] })
  rounds: Round[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
