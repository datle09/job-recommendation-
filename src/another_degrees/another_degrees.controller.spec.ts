import { Test, TestingModule } from '@nestjs/testing';
import { AnotherDegreesController } from './another_degrees.controller';
import { AnotherDegreesService } from './another_degrees.service';

describe('AnotherDegreesController', () => {
  let controller: AnotherDegreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnotherDegreesController],
      providers: [AnotherDegreesService],
    }).compile();

    controller = module.get<AnotherDegreesController>(AnotherDegreesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
