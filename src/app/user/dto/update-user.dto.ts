import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    is_reviewer: boolean;

    @IsOptional()
    updated_at: Date;
}