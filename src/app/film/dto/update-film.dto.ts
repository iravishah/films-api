import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class UpdateFilmDto {
    @IsOptional()
    @ApiProperty({
        description: 'Name of the film'
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        description: 'Description of the film'
    })
    description: string;

    @IsOptional()
    @ApiProperty({
        description: 'Release date of the film'
    })
    release_date: string;

    @IsOptional()
    @Max(5)
    @ApiProperty({
        description: 'Rating for the film',
        minimum: 1,
        maximum: 5
    })
    rating: number;

    @IsOptional()
    @ApiProperty({
        description: 'Give review for the film'
    })
    review: string;

    @IsOptional()
    @ApiProperty({
        description: 'Country where film is released'
    })
    country: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ApiProperty({
        description: 'Geners of the film',
        minItems: 1
    })
    genres: [];

    @IsOptional()
    @ApiProperty({
        description: 'Image of the film poster'
    })
    photo: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Reviewer of the film'
    })
    reviewer_id: string;

    @IsOptional()
    updated_at: Date;
}