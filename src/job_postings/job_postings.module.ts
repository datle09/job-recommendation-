import { Module } from '@nestjs/common';
import { JobPostingsService } from './job_postings.service';
import { AdminJobPostingsController, EmployerJobPostingsController, JobPostingsController } from './job_postings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosting } from './entities';
import { Employer } from 'src/employers/entities';
import { EmployersModule } from 'src/employers/employers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPosting, Employer]),
    EmployersModule,
  ],
  controllers: [JobPostingsController, EmployerJobPostingsController, AdminJobPostingsController],
  providers: [JobPostingsService],
})
export class JobPostingsModule {}
