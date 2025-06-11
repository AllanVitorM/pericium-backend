import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type OdontogramaDocument = Odontograma & Document & { _id: string };

@Schema()
export class Odontograma extends Document {
  @Prop()
  dentes: string;

  @Prop()
  tipodente: string;
  
  @Prop()
  imageUrl?: string;

  @Prop()
  observacoes: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vitima' })
  vitimaId: mongoose.Schema.Types.ObjectId;
}

export const OdontogramaSchema = SchemaFactory.createForClass(Odontograma);
