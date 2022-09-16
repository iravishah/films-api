import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty({
        description: 'Name of the user'
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        description: 'Description of the user'
    })
    description: string;

    @IsOptional()
    @ApiProperty({
        description: 'Send true if user is reviewer otherwise false',
        type: Boolean
    })
    is_reviewer: boolean;

    @IsOptional()
    updated_at: Date;
}