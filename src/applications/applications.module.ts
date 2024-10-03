import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    FirebaseModule
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
