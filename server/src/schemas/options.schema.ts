import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CardPack, CardPackSchema } from './cardPack.schema';
import { Timers, TimersSchema } from './timers.schema';
import { WinConditions, WinConditionsSchema } from './winConditions.schema';

export type OptionsDocument = Document & Options;

@Schema()
export class Options {
  @Prop({ required: true })
  maximumPlayers: number;

  @Prop()
  winnerBecomesCardCzar: boolean;

  @Prop()
  allowKickedPlayerJoin: boolean;

  @Prop()
  allowCardCzarPopularVote: boolean;

  @Prop()
  allowPopularVote: boolean;

  @Prop()
  password: string;

  @Prop({ required: true, type: WinConditionsSchema })
  winConditions: WinConditions;

  @Prop({ required: true, type: CardPackSchema })
  cardPacks: CardPack[];

  @Prop({ required: true, type: TimersSchema })
  timers: Timers;
}

export const OptionsSchema = SchemaFactory.createForClass(Options);
