import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities';
import { EmployersModule } from './employers/employers.module';
import { Employer } from './employers/entities';
import { OnlineProfilesModule } from './online_profiles/online_profiles.module';
import { OnlineProfile } from './online_profiles/entities';
import { AnotherDegreesModule } from './another_degrees/another_degrees.module';
import { AnotherDegree } from './another_degrees/entities';
import { EducationInformationsModule } from './education_informations/education_informations.module';
import { EducationInformation } from './education_informations/entities';
import { WorkExperiencesModule } from './work_experiences/work_experiences.module';
import { WorkExperience } from './work_experiences/entities';
import { JobPostingsModule } from './job_postings/job_postings.module';
import { JobPosting } from './job_postings/entities';
import { AttachedDocumentsModule } from './attached_documents/attached_documents.module';
import { AttachedDocument } from './attached_documents/entities';
import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/entities';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        database: config.get<string>('DATABASE_NAME'),
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get<string>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        entities: [User, Employee, Employer, OnlineProfile, AnotherDegree, EducationInformation, WorkExperience, JobPosting, AttachedDocument, Application],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    EmployeesModule,
    EmployersModule,
    OnlineProfilesModule,
    AnotherDegreesModule,
    EducationInformationsModule,
    WorkExperiencesModule,
    JobPostingsModule,
    AttachedDocumentsModule,
    ApplicationsModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
