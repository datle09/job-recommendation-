import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationsService {
  constructor (
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>
  ) {}

  async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository
      .createQueryBuilder('application')
      .select(['application', 'employee.userId', 'jobPosting.postId'])
      .leftJoin('application.employee', 'employee')
      .leftJoin('application.jobPosting', 'jobPosting')
      .leftJoin('jobPosting.employer', 'employer')
      .where('application_id = :id', {id})
      .getOne();

    if (!application) {
      throw new NotFoundException('Application not found')
    }
    return application;
  }

  async validateOwnershipAndGetResource(
    ownerId: number,
    id: number, 
  ): Promise<Application> {
    const application = await this.findOne(id);
    if (application.employee.userId === ownerId || application.jobPosting.employer.userId === ownerId) { 
      return application;
    }
    throw new ForbiddenException('You do not have permission');
  }

  async create(employeeId: number, createApplicationDto: CreateApplicationDto): Promise<Application> {
    try {
      const newApplication = this.applicationRepository.create({
        ...createApplicationDto,
        employee: { userId: employeeId}
      });
      const application = await this.applicationRepository.save(newApplication);
      return application;
    } catch (err) {
      if (err.code === '23503') {
        throw new NotFoundException('Employee not found')
      }
      throw err;
    }
  }

  findAll() {
    return `This action returns all applications`;
  }

  async update(employerId: number, id: number, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.validateOwnershipAndGetResource(employerId, id);
    Object.assign(application, updateApplicationDto);
    return this.applicationRepository.save(application);
  }

  async remove(employeeId: number, id: number): Promise<Application> {
    const application = await this.validateOwnershipAndGetResource(employeeId, id);
    return this.applicationRepository.remove(application);
  }
}
