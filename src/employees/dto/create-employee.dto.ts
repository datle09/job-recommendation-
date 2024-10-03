import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateEmployeeDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;
}
