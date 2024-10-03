import { Module } from '@nestjs/common';
import { WorkExperiencesService } from './work_experiences.service';
import { WorkExperiencesController } from './work_experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineProfile } from 'src/online_profiles/entities';
import { WorkExperience } from './entities';
import { OnlineProfilesModule } from 'src/online_profiles/online_profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnlineProfile, WorkExperience]),
    OnlineProfilesModule
  ],
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
