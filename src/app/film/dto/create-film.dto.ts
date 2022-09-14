import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class CreateFilmDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    release_date: string;

    @IsNotEmpty()
    @IsNumber()
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsString()
    review: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    genres: [];

    @IsNotEmpty()
    @IsString()
    photo: string;

    @IsNotEmpty()
    @IsString()
    reviewer_id: string;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}