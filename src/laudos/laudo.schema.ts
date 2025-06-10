import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LaudoDocument = Laudo & Document;
@Schema()
export class Laudo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  conteudo?: string;

  @Prop()
  pdfUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Evidencia' })
  evidenciaId: string;

  @Prop({ default: false })
  assinado: boolean;

  @Prop()
  dataAssinatura?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  peritoAssinante?: Types.ObjectId;
}

export const LaudoSchema = SchemaFactory.createForClass(Laudo);
