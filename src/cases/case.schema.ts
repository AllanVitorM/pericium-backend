import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Status } from 'src/common/enums/status.enum';

export type CaseDocument = Caso & Document;

@Schema({ collection: 'cases' })
export class Caso {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  status: Status;

  @Prop({ type: Date, required: true })
  dataAbertura: Date;

  @Prop({ type: Date })
  dataFechamento?: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
}
export const CaseSchema = SchemaFactory.createForClass(Caso);
