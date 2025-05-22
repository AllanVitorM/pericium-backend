import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Etnia } from 'src/common/enums/etnia.enum';

export type VitimaDocument = Vitima & Document & { _id: string };

@Schema()
export class Vitima extends Document {
  @Prop({ required: true })
  NIC: string;
  @Prop({ required: true })
  nome: string;
  @Prop({ required: true })
  genero: string;
  @Prop({
    required: true,
    unique: true,
    minlength: 11,
    maxlength: 11,
    match: /^\d{11}$/,
  })
  documento: number;
  @Prop({ required: true })
  endereco: string;
  @Prop({ type: String, enum: Etnia, required: true })
  etnia: Etnia;
}
export const VitimaSchema = SchemaFactory.createForClass(Vitima);
