import { Module } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employer } from './entities';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employer]),
    FirebaseModule
  ],
  controllers: [EmployersController],
  providers: [EmployersService],
  exports: [EmployersService],
})
export class EmployersModule {}
