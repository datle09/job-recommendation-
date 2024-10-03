import { Test, TestingModule } from '@nestjs/testing';
import { OnlineProfilesController } from './online_profiles.controller';
import { OnlineProfilesService } from './online_profiles.service';

describe('OnlineProfilesController', () => {
  let controller: OnlineProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineProfilesController],
      providers: [OnlineProfilesService],
    }).compile();

    controller = module.get<OnlineProfilesController>(OnlineProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
