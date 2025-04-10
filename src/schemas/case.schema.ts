import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type CaseDocument = Case & Document;

@Schema()
export class Case {
    
    @Prop({ required: true })
    titulo: string;

    @Prop({ required: true })
    descricao: string;

    @Prop({ required: true })
    status: string;

    @Prop({ type: Date, required: true})
    dataAbertura: Date;

    @Prop({ type: Date, required: true})
    dataFechamento: Date;

    @Prop({ type: String, enum: Role, required: true})
    role: Role;
}
export const CaseSchema = SchemaFactory.createForClass(Case);
