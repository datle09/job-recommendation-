import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateAnotherDegreeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    degreeName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    level: string
}
