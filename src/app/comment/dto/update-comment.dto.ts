import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCommentDto {
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
    updated_at: Date;
}