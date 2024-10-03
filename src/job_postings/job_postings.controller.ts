import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { JobPostingsService } from './job_postings.service';
import { CreateJobPostingDto, UpdateJobPostingDto, JobPostingQueryDto, AdminUpdateJobPostingDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { ApprovalStatus, UserRole } from 'src/shared/enums';
import { GetUser, Roles } from 'src/auth/decorator';
import { JobPosting } from './entities';
import { ApiResponse } from 'src/shared/interfaces';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Job Posting')
@Controller('job-postings')
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get('professions-statistics')
  async getProfessionsStatistics(): Promise<ApiResponse<any>> {
    const data = await this.jobPostingsService.getProfessionsStatistics(ApprovalStatus.approved);
    return {
      message: 'get professions statistics successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Query() query: JobPostingQueryDto,
  ): Promise<ApiResponse<Pagination<JobPosting>>> {
    const options: IPaginationOptions = {
      page,
      limit: limit > 100 ? 100 : limit,
    }; 
    
    // user only has access to the job postings has been approved
    Object.assign(query, { status: ApprovalStatus.approved });

    const data = await this.jobPostingsService.findAll(options, query);
    return {
      message: 'find all jobs posting successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.findOnePublicJobPosting(id);
    return {
      message: `find Job posting id ${id} successfully`,
      statusCode: 200,
      data: data
    }
  }
}

@ApiBearerAuth()
@ApiTags('Job Posting')
@Controller('employer/job-postings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployerJobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  @Roles(UserRole.EMPLOYER)
  async create(
    @GetUser('userId') employerId: number,
    @Body() createJobPostingDto: CreateJobPostingDto
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.create(employerId, createJobPostingDto);
    return {
      message: 'Job posting created successfully',
      statusCode: 201,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYER)
  async update(
    @GetUser('userId') employerId: number,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateJobPostingDto: UpdateJobPostingDto
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.update(employerId ,id, updateJobPostingDto);
    return {
      message: `Job posting id ${id} updated successfully`,
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYER)
  async remove(
    @GetUser('userId') employerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.remove(employerId, id);
    return {
      message: `Job posting id ${id} deleted successfully`,
      statusCode: 200,
      data: data
    }
  }

  @Get()
  @Roles(UserRole.EMPLOYER)
  async findAllMyJobPostings(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Query() query: JobPostingQueryDto,
    @GetUser('userId') employerId: number,
  ): Promise<ApiResponse<Pagination<JobPosting>>> {
    const options: IPaginationOptions = {
      page,
      limit: limit > 100 ? 100 : limit,
    };    

    // only return job postings if the user owns the job postings
    Object.assign(query, { employerId: employerId });

    const data = await this.jobPostingsService.findAll(options, query);
    return {
      message: 'find all my jobs posting successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get(':id')
  @Roles(UserRole.EMPLOYER)
  async findOneMyJobPosting(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') employerId: number,
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.validateOwnershipAndGetResource(employerId, id);
    return {
      message: `find Job posting id ${id} successfully`,
      statusCode: 200,
      data: data
    }
  }
}

@ApiBearerAuth()
@ApiTags('Job Posting')
@Controller('admin/job-postings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminJobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get('professions-statistics')
  @Roles(UserRole.ADMIN)
  async getProfessionsStatistics(
    @Query('status') status?: ApprovalStatus,
  ): Promise<ApiResponse<any>> {
    const data = await this.jobPostingsService.getProfessionsStatistics(status);
    return {
      message: 'get professions statistics successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Query() query: JobPostingQueryDto,
  ): Promise<ApiResponse<Pagination<JobPosting>>> {
    const options: IPaginationOptions = {
      page,
      limit: limit > 100 ? 100 : limit,
    };    

    const data = await this.jobPostingsService.findAll(options, query);
    return {
      message: 'find all jobs posting successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.findOne(+id);
    return {
      message: `find Job posting id ${id} successfully`,
      statusCode: 200,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() adminUpdateJobPostingDto: AdminUpdateJobPostingDto
  ): Promise<ApiResponse<JobPosting>> {
    const data = await this.jobPostingsService.updateByAdmin(id, adminUpdateJobPostingDto);
    return {
      message: `Job posting id ${id} updated successfully`,
      statusCode: 200,
      data: data
    }
  }

}



