import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Evidencia extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  tipo?: string;

  @Prop()
  local?: string;

  @Prop({ required: true })
  dateRegister: Date;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Case' })
  caseId: string;
}

export const EvidenciaSchema = SchemaFactory.createForClass(Evidencia);
