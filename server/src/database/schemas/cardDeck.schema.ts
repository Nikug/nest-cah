import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlackCard, BlackCardSchema } from './blackCard.schema';
import { CardPack, CardPackSchema } from './cardPack.schema';
import { WhiteCard, WhiteCardSchema } from './whiteCard.schema';

export type CardDeckDocument = Document & CardDeck;

@Schema()
export class CardDeck {
  @Prop({ required: true, type: [CardPackSchema] })
  cardPacks: CardPack[];

  @Prop({ required: true, type: [WhiteCardSchema] })
  whiteCards: WhiteCard[];

  @Prop({ required: true, type: [BlackCardSchema] })
  blackCards: BlackCard[];

  @Prop({ required: true, type: [BlackCardSchema] })
  sentBlackCards: BlackCard[];

  @Prop({ required: true, type: [WhiteCardSchema] })
  whiteCardDiscard: WhiteCard[];

  @Prop({ required: true, type: [BlackCardSchema] })
  blackCardDiscard: BlackCard[];

  @Prop({ required: true, type: [WhiteCardSchema] })
  whiteCardDeck: WhiteCard[];

  @Prop({ required: true, type: [BlackCardSchema] })
  blackCardDeck: BlackCard[];
}

export const CardDeckSchema = SchemaFactory.createForClass(CardDeck);
