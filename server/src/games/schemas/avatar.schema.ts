import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Document & Avatar;

@Schema()
export class Avatar {
  @Prop({ required: true })
  hat: number;

  @Prop({ required: true })
  eye: number;

  @Prop({ required: true })
  mouth: number;

  @Prop({ required: true })
  skin: number;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
