import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsBoolean, IsDate, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString, MinDate } from "class-validator"
import { Degree, EmploymentType, Experience, PositionLevel, Profession, Sex } from "src/shared/enums"

export class CreateJobPostingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @IsMobilePhone()
    @IsNotEmpty()
    @ApiProperty()
    phone: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    contactAddress: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    workAddress: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobTitle: string

    @IsEnum(Profession, { each: true })
    @IsNotEmpty()
    @ApiProperty()
    profession: Profession[];

    @IsEnum(EmploymentType)
    @IsNotEmpty()
    @ApiProperty()
    employmentType: EmploymentType

    @IsEnum(Degree)
    @IsNotEmpty()
    @ApiProperty()
    degree: Degree

    @IsEnum(Experience)
    @IsNotEmpty()
    @ApiProperty()
    experience: Experience

    @IsEnum(PositionLevel)
    @IsNotEmpty()
    @ApiProperty()
    positionLevel: PositionLevel

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    minAge?: number

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    maxAge?: number

    @IsEnum(Sex)
    @IsOptional()
    @ApiPropertyOptional()
    sex?: Sex | null

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    numberOfVacancies: number

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    trialPeriod?: number

    @IsDate()
    @IsNotEmpty()
    @Transform( ({ value }) => value && new Date(value))
    @MinDate(new Date())
    @ApiProperty()
    applicationDeadline: Date

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    minSalary?: number

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    maxSalary?: number

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    skills?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobDescription: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobRequirements: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    benefits: string

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    isHidden?: boolean
}

