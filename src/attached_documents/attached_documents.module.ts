import { Module } from '@nestjs/common';
import { AttachedDocumentsService } from './attached_documents.service';
import { AttachedDocumentsController } from './attached_documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachedDocument } from './entities';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([AttachedDocument]),
    FirebaseModule
  ],
  controllers: [AttachedDocumentsController],
  providers: [AttachedDocumentsService],
})
export class AttachedDocumentsModule {}
