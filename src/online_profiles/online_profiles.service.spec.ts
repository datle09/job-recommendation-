import { Test, TestingModule } from '@nestjs/testing';
import { OnlineProfilesService } from './online_profiles.service';

describe('OnlineProfilesService', () => {
  let service: OnlineProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineProfilesService],
    }).compile();

    service = module.get<OnlineProfilesService>(OnlineProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
