import { PartialType } from '@nestjs/swagger';
import { CreateAnotherDegreeDto } from './create-another_degree.dto';

export class UpdateAnotherDegreeDto extends PartialType(CreateAnotherDegreeDto) {}
