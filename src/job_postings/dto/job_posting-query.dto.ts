import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator"
import { ApprovalStatus, Degree, EmploymentType, Experience, PositionLevel, Profession, Sex } from "src/shared/enums"

export class JobPostingQueryDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    workAddress?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    jobTitle?: string

    @IsEnum(Profession)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: Profession
    })
    profession?: Profession

    @IsEnum(EmploymentType)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: EmploymentType
    })
    employmentType?: EmploymentType

    @IsEnum(Degree)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: Degree
    })
    degree?: Degree

    @IsEnum(Experience)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: Experience
    })
    experience?: Experience

    @IsEnum(PositionLevel)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: PositionLevel
    })
    positionLevel?: PositionLevel

    @IsEnum(Sex)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: Sex
    })
    sex?: Sex

    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional()
    employerId?: number

    @IsEnum(ApprovalStatus)
    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: ApprovalStatus
    })
    status?: ApprovalStatus
}

