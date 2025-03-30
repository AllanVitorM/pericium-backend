import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    senha: string;

    @Prop({ type: String, enum: Role, required: true})
    role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);