import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Name of the user'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Username of the user'
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Password of the user'
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Description of the user'
    })
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({
        description: 'Send true if user is reviewer otherwise false',
        type: Boolean
    })
    is_reviewer: boolean;

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}