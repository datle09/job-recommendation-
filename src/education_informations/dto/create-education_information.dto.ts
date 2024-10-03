import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDate, IsDateString, IsNotEmpty, IsString, MaxDate } from "class-validator"

export class CreateEducationInformationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    schoolName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    specialization: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    degreeName: string

    @IsDate()
    @IsNotEmpty()
    @Transform( ({ value }) => value && new Date(value))
    @MaxDate(new Date())
    @ApiProperty()
    startDate: Date

    @IsDate()
    @IsNotEmpty()
    @Transform( ({ value }) => value && new Date(value))
    @MaxDate(new Date())
    @ApiProperty()
    endDate: Date
}
