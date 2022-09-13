import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { v4 } from 'uuid';

const PREFIX = 'bd';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        default: () => { return `${PREFIX}${v4()}` }
    })
    id: string

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    name: string

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    })
    username: string

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    password: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    description: string;

    @Prop({
        type: mongoose.Schema.Types.Boolean,
        required: true
    })
    is_reviewer: string;

    @Prop({
        type: mongoose.Schema.Types.Date,
        required: true
    })
    created_at: Date

    @Prop({
        type: mongoose.Schema.Types.Date,
        required: true
    })
    updated_at: Date
}

export const UserSchema = SchemaFactory.createForClass(User);