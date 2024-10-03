import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Degree, EmploymentType, Experience, PositionLevel, Profession } from "src/shared/enums";

export class CreateOnlineProfileDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    jobTitle: string;

    @IsEnum(Profession, { each: true })
    @IsNotEmpty()
    @ApiProperty()
    profession: Profession[];

    @IsEnum(PositionLevel)
    @IsNotEmpty()
    @ApiProperty()
    currentPosition: PositionLevel;

    @IsEnum(PositionLevel)
    @IsNotEmpty()
    @ApiProperty()
    desiredPosition: PositionLevel;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    desiredSalary: number

    @IsEnum(Degree)
    @IsNotEmpty()
    @ApiProperty()
    degree: Degree

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    workAddress: string

    @IsEnum(Experience)
    @IsNotEmpty()
    @ApiProperty()
    experience: Experience

    @IsEnum(EmploymentType)
    @IsNotEmpty()
    @ApiProperty()
    employmentType: EmploymentType

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    careerGoal?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    skills?: string
   
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    isHidden?: boolean
}
