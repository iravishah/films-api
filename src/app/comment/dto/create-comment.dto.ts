import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    film_id: string;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsOptional()
    user_id: string;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}