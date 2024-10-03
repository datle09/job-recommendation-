import { PartialType } from '@nestjs/swagger';
import { CreateEducationInformationDto } from './create-education_information.dto';

export class UpdateEducationInformationDto extends PartialType(CreateEducationInformationDto) {}
