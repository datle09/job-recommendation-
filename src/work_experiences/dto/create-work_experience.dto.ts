import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxDate } from "class-validator"

export class CreateWorkExperienceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobTitle: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    companyName: string

    @IsDate()
    @IsNotEmpty()
    @Transform(({value}) => value && new Date(value))
    @MaxDate(new Date())
    @ApiProperty()
    startDate: Date

    @IsDate()
    @IsOptional()
    @Transform(({value}) => value && new Date(value))
    @MaxDate(new Date())
    @ApiProperty()
    endDate?: Date | null

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobDescription: string
}
