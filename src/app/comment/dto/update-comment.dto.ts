import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsOptional()
    @ApiProperty({
        description: 'Film for which you have to add the comment'
    })
    film_id: string;

    @IsOptional()
    @ApiProperty({
        description: 'Comment for the film'
    })
    comment: string;

    @IsOptional()
    user_id: string;

    @IsOptional()
    updated_at: Date;
}