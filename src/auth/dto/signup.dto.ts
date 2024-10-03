import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from 'src/shared/enums';

export class SignupDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    confirmPassword: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    @ApiProperty()
    role: UserRole;
}
