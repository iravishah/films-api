import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { v4 } from 'uuid';

import { User } from '../../user/schemas/user.schema';

const PREFIX = 'flm';

export type FilmDocument = Film & Document;

@Schema()
export class Film {
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
        required: true
    })
    description: string

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    release_date: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true
    })
    rating: number;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    review: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    country: string;

    @Prop({
        type: mongoose.Schema.Types.Array,
        required: true
    })
    genres: [string];

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    photo: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    reviewer_id: User;

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

export const FilmSchema = SchemaFactory.createForClass(Film);