import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateOnlineProfileDto } from "src/online_profiles/dto";

export class CreateAttachedDocumentDto extends CreateOnlineProfileDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    cv: string;
}

