import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OdontogramaDocument = Odontograma & Document & { _id: string };

@Schema()
export class Odontograma extends Document {
  @Prop()
  dentes: string;

  @Prop()
  observacoes: string;
}

export const OdontogramaSchema = SchemaFactory.createForClass(Odontograma);
