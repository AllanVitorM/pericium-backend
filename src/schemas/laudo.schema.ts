import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Laudo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  evidencia:({type: Types.ObjectId, ref: 'Evidencias'});

  @Prop({ type: Types.ObjectId, ref: 'User' })
  peritoresponsavel: string;

}

export const LaudoSchema = SchemaFactory.createForClass(Laudo);
