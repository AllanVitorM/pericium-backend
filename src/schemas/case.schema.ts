import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaseDocument = Caso & Document;

@Schema()
export class Caso {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Date, required: true })
  dataAbertura: Date;

  @Prop({ type: Date })
  dataFechamento?: Date;
}
export const CaseSchema = SchemaFactory.createForClass(Caso);
