import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities';
import { UsersModule } from 'src/users/users.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    UsersModule,
    FirebaseModule
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
