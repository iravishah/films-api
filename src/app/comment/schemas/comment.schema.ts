import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { v4 } from 'uuid';

import { Film } from "../../film/schemas/film.schema";
import { User } from "../../user/schemas/user.schema";

const PREFIX = 'flm';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        default: () => { return `${PREFIX}${v4()}` }
    })
    id: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    })
    film_id: Film;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    comment: string

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    user_id: string;

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

export const CommentSchema = SchemaFactory.createForClass(Comment)