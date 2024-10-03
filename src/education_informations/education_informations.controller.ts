import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EducationInformationsService } from './education_informations.service';
import { CreateEducationInformationDto, UpdateEducationInformationDto } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { ApiResponse } from 'src/shared/interfaces';
import { EducationInformation } from './entities';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Education informations')
@Controller('education-informations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EducationInformationsController {
  constructor(private readonly educationInformationsService: EducationInformationsService) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(
    @GetUser('userId') onlineProfileId: number,
    @Body() createEducationInformationDto: CreateEducationInformationDto
  ): Promise<ApiResponse<EducationInformation>> {
    const data = await this.educationInformationsService.create(onlineProfileId, createEducationInformationDto);
    return {
      message: 'Education Information created successfully',
      statusCode: 201,
      data: data,
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  async update(
    @GetUser('userId') onlineProfileId: number,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEducationInformationDto: UpdateEducationInformationDto
  ): Promise<ApiResponse<EducationInformation>> {
    const data = await this.educationInformationsService.update(onlineProfileId, id, updateEducationInformationDto);
    return {
      message: `Education Information id ${id} updated successfully`,
      statusCode: 200,
      data: data,
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  async remove(
    @GetUser('userId') onlineProfileId: number,
    @Param('id', ParseIntPipe) id: number,   
  ): Promise<ApiResponse<EducationInformation>> {
    const data = await this.educationInformationsService.remove(onlineProfileId, id);
    return {
      message: `Education Information id ${id} deleted successfully`,
      statusCode: 200,
      data: data
    }
  }
}
