import { Test, TestingModule } from '@nestjs/testing';
import { AnotherDegreesService } from './another_degrees.service';

describe('AnotherDegreesService', () => {
  let service: AnotherDegreesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnotherDegreesService],
    }).compile();

    service = module.get<AnotherDegreesService>(AnotherDegreesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
