import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlackCard, BlackCardSchema } from './blackCard.schema';
import { PlayedCards, PlayedCardsSchema } from './playedCards.schema';

export type RoundDocument = Document & Round;

@Schema()
export class Round {
  @Prop({ required: true })
  round: number;

  @Prop({ required: true })
  cardIndex: number;

  @Prop({ type: BlackCardSchema })
  blackCard: BlackCard;

  @Prop({ required: true })
  cardCzarId: string;

  @Prop({ required: true, type: PlayedCardsSchema })
  playedCards: PlayedCards[];
}

export const RoundSchema = SchemaFactory.createForClass(Round);
