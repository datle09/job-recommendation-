import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobPostingDto, UpdateJobPostingDto, JobPostingQueryDto, AdminUpdateJobPostingDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPosting } from './entities';
import { Brackets, Repository } from 'typeorm';
import { Employer } from 'src/employers/entities';
import { EmployersService } from 'src/employers/employers.service';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ApprovalStatus, Profession } from 'src/shared/enums';


@Injectable()
export class JobPostingsService {
  constructor(
    @InjectRepository(JobPosting)
    private jobPostingRepository: Repository<JobPosting>,
    @InjectRepository(Employer)
    private employerRepository: Repository<Employer>,
    private employerService: EmployersService,
  ) {}

  async findOne(id: number): Promise<JobPosting> {
    const jobPosting = await this.jobPostingRepository
      .createQueryBuilder('jobPosting')
      .select(['jobPosting', 'employer.userId'])
      .leftJoin('jobPosting.employer','employer')
      .where('jobPosting.postId = :id', {id})
      .getOne();

    if (!jobPosting) {
      throw new NotFoundException('job Posting not found');
    }
    return jobPosting;
  }

  async validateOwnershipAndGetResource(
    employerId: number, 
    id: number, 
  ): Promise<JobPosting> {
    const jobPosting = await this.findOne(id);
    if (jobPosting.employer.userId !== employerId) {
      throw new ForbiddenException('You do not owner this JobPosting');
    }
    return jobPosting;
  }

  async create(employerId: number, createJobPostingDto: CreateJobPostingDto): Promise<JobPosting> {
    const employer = await this.employerService.findOne(employerId);

    const newJobPosting = this.jobPostingRepository.create(createJobPostingDto);
    const jobPosting = await this.jobPostingRepository.save(newJobPosting);

    employer.job_postings.push(jobPosting);
    await this.employerRepository.save(employer);
    return jobPosting;
  }

  async update(
    employerId: number, 
    id: number, 
    updateJobPostingDto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    const jobPosting = await this.validateOwnershipAndGetResource(employerId, id);
    Object.assign(jobPosting, updateJobPostingDto);
    return this.jobPostingRepository.save(jobPosting);
  }

  async remove(
    employerId: number, 
    id: number,
  ): Promise<JobPosting> {
    const jobPosting = await this.validateOwnershipAndGetResource(employerId, id);
    return this.jobPostingRepository.remove(jobPosting);
  }

  async findAll(options: IPaginationOptions, query: JobPostingQueryDto): Promise<Pagination<JobPosting>>{
    // TODO: implement query buider
    const queryBuilder = this.jobPostingRepository
      .createQueryBuilder('jobPosting')
      .leftJoinAndSelect('jobPosting.employer', 'employer')

    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, employerId, status } = query;
    if (status)         queryBuilder.andWhere('jobPosting.status = :status', { status });
    if (workAddress)    queryBuilder.andWhere('jobPosting.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    if (jobTitle)       queryBuilder.andWhere('jobPosting.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    if (profession)     queryBuilder.andWhere(':profession = ANY(jobPosting.profession)', { profession });
    if (employmentType) queryBuilder.andWhere('jobPosting.employmentType = :employmentType', { employmentType });
    if (degree)         queryBuilder.andWhere('jobPosting.degree = :degree', { degree });
    if (experience)     queryBuilder.andWhere('jobPosting.experience = :experience', { experience });
    if (positionLevel)  queryBuilder.andWhere('jobPosting.positionLevel = :positionLevel', { positionLevel });
    if (employerId) queryBuilder.andWhere('jobPosting.employer.userId = :employerId', { employerId });
    if (sex) {
      queryBuilder.andWhere(
          new Brackets(qb =>
              qb.where('jobPosting.sex = :sex', { sex })
                  .orWhere('jobPosting.sex IS NULL')
          )
      );
    }
  
    return paginate<JobPosting>(queryBuilder, options);
  }

  async findOnePublicJobPosting(id: number): Promise<JobPosting> {
    const jobPosting = await this.jobPostingRepository
      .createQueryBuilder('jobPosting')
      .leftJoinAndSelect('jobPosting.employer','employer')
      .where('jobPosting.postId = :id', {id})
      .andWhere('jobPosting.status = :status',{status: ApprovalStatus.approved})
      .getOne();

    if (!jobPosting) {
      throw new NotFoundException('job Posting not found');
    }

    // TODO: view increase when user get job Posting #id 
    jobPosting.view += 1
    await jobPosting.save()

    return jobPosting;
  }

  async updateByAdmin(
    id: number, 
    adminUpdateJobPostingDto: AdminUpdateJobPostingDto,
  ): Promise<JobPosting> {
    const jobPosting = await this.findOne(id);
    Object.assign(jobPosting, adminUpdateJobPostingDto);
    return this.jobPostingRepository.save(jobPosting);
  }

  async getProfessionsStatistics(status?: ApprovalStatus) {
    let query = this.jobPostingRepository
      .createQueryBuilder('jobPosting')
      .select(`UNNEST(jobPosting.profession)`, 'profession_value')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profession_value')

    if (status) {
      query = query.where('jobPosting.status = :status', { status })
    }

    return query.getRawMany();
  }
}
