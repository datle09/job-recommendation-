import { Test, TestingModule } from '@nestjs/testing';
import { EducationInformationsService } from './education_informations.service';

describe('EducationInformationsService', () => {
  let service: EducationInformationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationInformationsService],
    }).compile();

    service = module.get<EducationInformationsService>(EducationInformationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
