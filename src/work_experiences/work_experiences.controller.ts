import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { WorkExperiencesService } from './work_experiences.service';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { ApiResponse } from 'src/shared/interfaces';
import { WorkExperience } from './entities';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Work experiences')
@Controller('work-experiences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkExperiencesController {
  constructor(private readonly workExperiencesService: WorkExperiencesService) {}
  
  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(
    @GetUser('userId') onlineProfileId : number,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<ApiResponse<WorkExperience>> {
    const data = await this.workExperiencesService.create(onlineProfileId, createWorkExperienceDto);
    return {
      message: 'Work Experience created successfully',
      statusCode: 201,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  async update(
    @GetUser('userId') onlineProfileId : number,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto
  ): Promise<ApiResponse<WorkExperience>> {
    const data = await this.workExperiencesService.update(onlineProfileId, id, updateWorkExperienceDto);
    return {
      message: `Work Experience id ${id} updated successfully`,
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  async remove(
    @GetUser('userId') onlineProfileId : number,
    @Param('id', ParseIntPipe) id: number, 
  ): Promise<ApiResponse<WorkExperience>> {
    const data = await this.workExperiencesService.remove(onlineProfileId, id);
    return {
      message: `Work Experience id ${id} deleted successfully`,
      statusCode: 200,
      data: data
    }
  }
}
