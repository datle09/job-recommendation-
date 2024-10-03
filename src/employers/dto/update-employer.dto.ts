import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateEmployerDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    taxCode?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    companyLocation?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    careerField?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    logo?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    banner?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description?: string;
}
