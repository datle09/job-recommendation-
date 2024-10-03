import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsOptional } from "class-validator";
import { UpdateUserDto } from "src/users/dto";

export class UpdateEmployeeDto extends UpdateUserDto {
    @IsBooleanString()
    @IsOptional()
    @ApiPropertyOptional({
        type: "boolean"
    })
    isMarried?: boolean
}

