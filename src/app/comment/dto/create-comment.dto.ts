import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Film for which you have to add the comment'
    })
    film_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Comment for the film'
    })
    comment: string;

    @IsOptional()
    user_id: string;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}