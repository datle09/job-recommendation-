import { Module } from '@nestjs/common';
import { AnotherDegreesService } from './another_degrees.service';
import { AnotherDegreesController } from './another_degrees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnotherDegree } from './entities';
import { OnlineProfilesModule } from 'src/online_profiles/online_profiles.module';
import { OnlineProfile } from 'src/online_profiles/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnlineProfile, AnotherDegree]),
    OnlineProfilesModule
  ],
  controllers: [AnotherDegreesController],
  providers: [AnotherDegreesService],
})
export class AnotherDegreesModule {}
