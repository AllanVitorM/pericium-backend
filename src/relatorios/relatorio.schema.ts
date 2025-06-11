import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RelatorioDocument = Relatorio & Document;

@Schema({ timestamps: true })
export class Relatorio {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  pdfUrl?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Caso', unique: true })
  caseId: Types.ObjectId;

  @Prop({ default: false })
  assinado: boolean;

  @Prop({ type: Date })
  dataAssinatura?: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  peritoAssinante: Types.ObjectId;
}

export const RelatorioSchema = SchemaFactory.createForClass(Relatorio);
