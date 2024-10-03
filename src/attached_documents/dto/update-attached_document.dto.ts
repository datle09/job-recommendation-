import { PartialType } from '@nestjs/swagger';
import { CreateAttachedDocumentDto } from './create-attached_document.dto';

export class UpdateAttachedDocumentDto extends PartialType(CreateAttachedDocumentDto) {}
