import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class EmployerQueryDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    companyName?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    companyLocation?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    careerField?: string
}