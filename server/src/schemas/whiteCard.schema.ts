import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WhiteCardDocument = Document & WhiteCard;

@Schema()
export class WhiteCard {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  cardPackId: string;

  @Prop({ required: true })
  text: string;
}

export const WhiteCardSchema = SchemaFactory.createForClass(WhiteCard);
