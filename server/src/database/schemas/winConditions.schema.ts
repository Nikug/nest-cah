import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WinConditionsDocument = Document & WinConditions;

@Schema()
export class WinConditions {
  @Prop({ required: true })
  scoreLimit: number;

  @Prop({ required: true })
  useScoreLimit: boolean;

  @Prop({ required: true })
  roundLimit: number;

  @Prop({ required: true })
  useRoundLimit: boolean;
}

const WinConditionsSchema = SchemaFactory.createForClass(WinConditions);
WinConditionsSchema.set('toObject', {
  transform(_, ret) {
    delete ret._id;
    return ret;
  },
});
export { WinConditionsSchema };
