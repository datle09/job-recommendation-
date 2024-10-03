import { PartialType } from '@nestjs/swagger';
import { CreateOnlineProfileDto } from './create-online_profile.dto';

export class UpdateOnlineProfileDto extends PartialType(CreateOnlineProfileDto) {}
