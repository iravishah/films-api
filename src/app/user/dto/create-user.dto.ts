import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    is_reviewer: boolean;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}