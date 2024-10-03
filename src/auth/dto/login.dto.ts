import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The email address used to uniquely identify the user',
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The user’s password',
    })
    password: string;
}