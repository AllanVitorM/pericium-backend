/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';



@Schema()
export class User extends Document {
    
    @Prop({ required: true, unique: true, minlength: 11, maxlength: 11, match: /^\d{11}$/,})
    cpf: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Role, required: true})
    role: Role;

}
export type UserDocument = User & Document & {_id: string} ;
export const UserSchema = SchemaFactory.createForClass(User);