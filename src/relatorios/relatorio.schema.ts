import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RelatorioDocument = Relatorio & Document;
@Schema()
export class Relatorio extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  pdfUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Caso' })
  evidenciaId: string;

  @Prop({ default: false })
  assinado: boolean;

  @Prop()
  dataAssinatura?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  peritoAssinante?: Types.ObjectId;
}

export const RelatorioSchema = SchemaFactory.createForClass(Relatorio);
