import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WhiteCard, WhiteCardSchema } from './whiteCard.schema';

export type PlayedCardsDocument = Document & PlayedCards;

@Schema()
export class PlayedCards {
  @Prop({ required: true })
  playerId: string;

  @Prop({ required: true })
  popularVotes: string[];

  @Prop()
  winner: boolean;

  @Prop({ required: true, type: WhiteCardSchema })
  whiteCards: WhiteCard[];
}

export const PlayedCardsSchema = SchemaFactory.createForClass(PlayedCards);
