import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingsController } from './job_postings.controller';
import { JobPostingsService } from './job_postings.service';

describe('JobPostingsController', () => {
  let controller: JobPostingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostingsController],
      providers: [JobPostingsService],
    }).compile();

    controller = module.get<JobPostingsController>(JobPostingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
