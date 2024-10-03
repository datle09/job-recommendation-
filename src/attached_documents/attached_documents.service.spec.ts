import { Test, TestingModule } from '@nestjs/testing';
import { AttachedDocumentsService } from './attached_documents.service';

describe('AttachedDocumentsService', () => {
  let service: AttachedDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttachedDocumentsService],
    }).compile();

    service = module.get<AttachedDocumentsService>(AttachedDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
