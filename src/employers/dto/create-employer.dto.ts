import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateEmployerDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;
}
