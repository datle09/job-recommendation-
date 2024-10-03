import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { ApiResponse } from 'src/shared/interfaces';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  async getProfile(
    @GetUser('userId') id: number
  ): Promise<ApiResponse<any>> {
    const data = await this.employeesService.getProfile(id);
    return {
      message: 'get your profile successfully',
      statusCode: 200,
      data: data
    }
  }

  @Patch('me')
  @Roles(UserRole.EMPLOYEE)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async update(
    @GetUser('userId') id: number, 
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse<any>> {
    if (file) {
      updateEmployeeDto.avatar = await this.firebaseService.updateFileByUserId(file, id, 'avatar');
    } else if (updateEmployeeDto?.avatar) {
      delete updateEmployeeDto.avatar;
    }

    const data = await this.employeesService.update(id, updateEmployeeDto);
    return {
      message: 'update employee successfull',
      statusCode: 200,
      data: data
    }
  }

}
