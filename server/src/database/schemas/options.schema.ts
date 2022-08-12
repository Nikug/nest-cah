import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
  allowPopularVote: boolean;

  @Prop()
  allowCardCzarPopularVote: boolean;

  @Prop()
  password?: string;

  @Prop({ required: true, type: WinConditionsSchema })
  winConditions: WinConditions;

  @Prop({ required: true, type: TimersSchema })
  timers: Timers;
}

const OptionsSchema = SchemaFactory.createForClass(Options);
OptionsSchema.set('toObject', {
  transform(_, ret) {
    delete ret._id;
    return ret;
  },
});
export { OptionsSchema };
