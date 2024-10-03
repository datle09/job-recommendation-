import { Module } from '@nestjs/common';
import { EducationInformationsService } from './education_informations.service';
import { EducationInformationsController } from './education_informations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineProfile } from 'src/online_profiles/entities';
import { EducationInformation } from './entities';
import { OnlineProfilesModule } from 'src/online_profiles/online_profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnlineProfile, EducationInformation]),
    OnlineProfilesModule
  ],
  controllers: [EducationInformationsController],
  providers: [EducationInformationsService],
})
export class EducationInformationsModule {}
