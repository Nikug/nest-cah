import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TimersDocument = Document & Timers;

@Schema()
export class Timers {
  @Prop({ required: true })
  blackCardSelect: number;

  @Prop({ required: true })
  useBlackCardSelect: boolean;

  @Prop({ required: true })
  whiteCardSelect: number;

  @Prop({ required: true })
  useWhiteCardSelect: boolean;

  @Prop({ required: true })
  blackCardRead: number;

  @Prop({ required: true })
  useBlackCardRead: boolean;

  @Prop({ required: true })
  winnerSelect: number;

  @Prop({ required: true })
  useWinnerSelect: boolean;

  @Prop({ required: true })
  roundEnd: number;

  @Prop({ required: true })
  useRoundEnd: boolean;
}

const TimersSchema = SchemaFactory.createForClass(Timers);
TimersSchema.set('toObject', {
  transform(_, ret) {
    delete ret._id;
    return ret;
  },
});
export { TimersSchema };
