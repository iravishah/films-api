import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    reviewer_id: string;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}