import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserDocument } from '../users/user.schema'; // Adjust the import path as needed

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ default: false })
    completed: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Schema.Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
