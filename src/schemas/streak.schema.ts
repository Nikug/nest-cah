import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StreakDocument = Document & Streak;

@Schema()
export class Streak {
  @Prop({ required: true })
  playerId: string;

  @Prop({ required: true })
  wins: number;
}

export const StreakSchema = SchemaFactory.createForClass(Streak);
