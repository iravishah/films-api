import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class UpdateFilmDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Name of the film'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Description of the film'
    })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Release date of the film'
    })
    release_date: string;

    @IsNotEmpty()
    @IsNumber()
    @Max(5)
    @ApiProperty({
        description: 'Rating for the film',
        minimum: 1,
        maximum: 5
    })
    rating: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Give review for the film'
    })
    review: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Country where film is released'
    })
    country: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ApiProperty({
        description: 'Geners of the film',
        minItems: 1
    })
    genres: [];

    @IsNotEmpty()
    @IsString()
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