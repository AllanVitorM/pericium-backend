import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LaudoDocument = Laudo & Document;

@Schema({ timestamps: true })
export class Laudo {
  @Prop({ required: true }) title: string;

  @Prop() description?: string;

  @Prop() pdfUrl?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Evidencia', unique: true })
  evidenciaId: Types.ObjectId;

  @Prop({ default: false }) assinado: boolean;

  @Prop() dataAssinatura?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' }) peritoAssinante?: Types.ObjectId;

  // ✅ Adicionado para evitar erro no TypeScript
  _id?: Types.ObjectId;
}

export const LaudoSchema = SchemaFactory.createForClass(Laudo);

// ✅ Permite exibir o "id" em vez de "_id"
LaudoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});
