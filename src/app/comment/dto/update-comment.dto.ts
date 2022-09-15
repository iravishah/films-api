import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    @IsString()
    film_id: string;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsOptional()
    user_id: string;

    @IsOptional()
    updated_at: Date;
}