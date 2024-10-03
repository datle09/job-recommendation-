import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployerDto, EmployerQueryDto, UpdateEmployerDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employer } from './entities';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class EmployersService {
  constructor(
    @InjectRepository(Employer)
    private employerRepository: Repository<Employer>,
  ) {}

  async create(createEmployerDto: CreateEmployerDto): Promise<Employer> {
    const newEmployer = this.employerRepository.create(createEmployerDto);
    return this.employerRepository.save(newEmployer);
  }

  async findAll(options: IPaginationOptions, query: EmployerQueryDto): Promise<Pagination<Employer>> {
    const queryBuilder = this.employerRepository
      .createQueryBuilder('employer')

    const { companyName, companyLocation, careerField } = query;
    if (companyName) {
      queryBuilder.andWhere('employer.companyName LIKE :companyName', {companyName: `%${companyName}%`});
    }
    if (companyLocation) {
      queryBuilder.andWhere('employer.companyLocation LIKE :companyLocation', {companyLocation: `%${companyLocation}%`});
    }
    if (careerField) {
      queryBuilder.andWhere('employer.careerField = :careerField', {careerField});
    }

    return paginate<Employer>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Employer> {
    const employer = await this.employerRepository.findOne({
      where: {userId: id},
      relations: ['job_postings'],
    });
    if (!employer) {
       throw new NotFoundException('Employer not found');
    }
    return employer;
  }

  async update(id: number, updateEmployerDto: UpdateEmployerDto): Promise<Employer> {
    const employer = await this.findOne(id);
    Object.assign(employer, updateEmployerDto);
    return this.employerRepository.save(employer);
  }

  remove(id: number) {
    return `This action removes a #${id} employer`;
  }
}
