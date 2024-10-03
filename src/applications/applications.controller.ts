import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/shared/enums';
import { ApiResponse } from 'src/shared/interfaces';
import { Application } from './entities';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  async create(
    @GetUser('userId') employeeId : number,
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse<Application>> {
    if (file) {
      createApplicationDto.cv = await this.firebaseService.uploadFileByUserId(file, employeeId, 'application/cv');
    } 

    const data = await this.applicationsService.create(employeeId, createApplicationDto);
    return {
      message: 'Application created successfully',
      statusCode: 201,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYER)
  async update(
    @GetUser('userId') employerId : number,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateApplicationDto: UpdateApplicationDto
  ): Promise<ApiResponse<Application>>{
    const data = await this.applicationsService.update(employerId, id, updateApplicationDto);
    return {
      message: 'Application updated successfully',
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  async remove(
    @GetUser('userId') employeeId : number,
    @Param('id', ParseIntPipe) id: number, 
  ): Promise<ApiResponse<Application>>{ 
    const data = await this.applicationsService.remove(employeeId,id);
    return {
      message: 'Application deleted successfully',
      statusCode: 200,
      data: data
    }
  }
}
