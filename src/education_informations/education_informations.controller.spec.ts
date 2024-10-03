import { Test, TestingModule } from '@nestjs/testing';
import { EducationInformationsController } from './education_informations.controller';
import { EducationInformationsService } from './education_informations.service';

describe('EducationInformationsController', () => {
  let controller: EducationInformationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationInformationsController],
      providers: [EducationInformationsService],
    }).compile();

    controller = module.get<EducationInformationsController>(EducationInformationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
