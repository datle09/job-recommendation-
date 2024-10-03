import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttachedDocumentDto } from './dto/create-attached_document.dto';
import { UpdateAttachedDocumentDto } from './dto/update-attached_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachedDocument } from './entities';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class AttachedDocumentsService {
  constructor(
    @InjectRepository(AttachedDocument)
    private attachedDocumentRepository: Repository<AttachedDocument>,
  ) {}

  async isUserIdExists(userId: number): Promise<boolean> {
    const resource = await this.attachedDocumentRepository.findOneBy({userId: userId});
    return !!resource;
  }

  async create(id: number, createAttachedDocumentDto: CreateAttachedDocumentDto): Promise<AttachedDocument> {
    const isUserIdExists = await this.isUserIdExists(id);
    if (isUserIdExists) {
      throw new ConflictException(`attached document has userId ${id} already exists`);
    }
    const newAttachedDocument = this.attachedDocumentRepository.create({...createAttachedDocumentDto, userId: id});
    const attached_document = await this.attachedDocumentRepository.save(newAttachedDocument);
    return attached_document;
  }

  findAll() {
    return `This action returns all attachedDocuments`;
  }

  async findOne(id: number): Promise<AttachedDocument> {
    const attachedDocument = await this.attachedDocumentRepository.findOne({
      where: {userId: id},
    });
    if (!attachedDocument) {
      throw new NotFoundException('Attached Document not found');
    }
    return attachedDocument;
  }

  async update(id: number, updateAttachedDocumentDto: UpdateAttachedDocumentDto): Promise<AttachedDocument> {
    const attachedDocument = await this.findOne(id);
    Object.assign(attachedDocument, updateAttachedDocumentDto);
    return this.attachedDocumentRepository.save(attachedDocument);   
  }

  async remove(id: number): Promise<DeleteResult> {
    const attachedDocument = await this.findOne(id);
    return this.attachedDocumentRepository.delete({userId: attachedDocument.userId});
  }
}

