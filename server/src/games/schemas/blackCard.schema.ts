import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlackCardDocument = Document & BlackCard;

@Schema()
export class BlackCard {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  cardPackId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  whiteCardsToPlay: number;
}

export const BlackCardSchema = SchemaFactory.createForClass(BlackCard);
