import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardPackDocument = Document & CardPack;

@Schema()
export class CardPack {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nsfw: boolean;

  @Prop({ required: true })
  whiteCards: number;

  @Prop({ required: true })
  blackCards: number;
}

export const CardPackSchema = SchemaFactory.createForClass(CardPack);
