import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlayerState } from '../interfaces/games.interfaces';
import { Avatar, AvatarSchema } from './avatar.schema';
import { WhiteCard, WhiteCardSchema } from './whiteCard.schema';

export type PlayerDocument = Document & Player;

@Schema()
export class Player {
  @Prop({ required: true, unique: true })
  socketId: string;

  @Prop({ required: true })
  PublicId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  state: PlayerState;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, type: AvatarSchema })
  avatar: Avatar;

  @Prop({ required: true, type: [WhiteCardSchema] })
  whiteCards: WhiteCard[];

  @Prop()
  isCardCzar: boolean;

  @Prop()
  isHost: boolean;

  @Prop()
  isPopularVoteKing: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
