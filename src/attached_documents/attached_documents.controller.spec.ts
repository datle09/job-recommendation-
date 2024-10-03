import { Test, TestingModule } from '@nestjs/testing';
import { AttachedDocumentsController } from './attached_documents.controller';
import { AttachedDocumentsService } from './attached_documents.service';

describe('AttachedDocumentsController', () => {
  let controller: AttachedDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachedDocumentsController],
      providers: [AttachedDocumentsService],
    }).compile();

    controller = module.get<AttachedDocumentsController>(AttachedDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
