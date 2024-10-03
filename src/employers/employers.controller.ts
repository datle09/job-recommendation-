import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, DefaultValuePipe, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto, EmployerQueryDto, UpdateEmployerDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/shared/enums';
import { ApiResponse } from 'src/shared/interfaces';
import { Employer } from './entities';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Employers')
@Controller('employers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployersController {
  constructor(
    private readonly employersService: EmployersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Query()
    query: EmployerQueryDto
  ): Promise<ApiResponse<Pagination<Employer>>> {
    const options: IPaginationOptions = {
      page,
      limit: limit > 100 ? 100 : limit,
    };    
    const data = await this.employersService.findAll(options, query);
    return {
      message: 'find all companies successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get('me')
  @Roles(UserRole.EMPLOYER)
  async getMe(
    @GetUser('userId') id: number
  ): Promise<ApiResponse<Employer>> {
    const data = await this.employersService.findOne(id);
    return {
      message: 'get company successfully',
      statusCode: 200,
      data: data
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ApiResponse<Employer>> {
    const data = await this.employersService.findOne(id);
    return {
      message: 'get company successfully',
      statusCode: 200,
      data: data
    }
  }

  @Patch('me')
  @Roles(UserRole.EMPLOYER)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data')
  async update(
    @GetUser('userId') id: number, 
    @Body() updateEmployerDto: UpdateEmployerDto,
    @UploadedFiles() files: { logo?: Express.Multer.File[], banner?: Express.Multer.File[] }
  ): Promise<ApiResponse<Employer>> {
    if (files?.logo?.length) {
      updateEmployerDto.logo = await this.firebaseService.updateFileByUserId(files.logo[0], id, 'logo');
    } else if (updateEmployerDto?.logo) {
      delete updateEmployerDto.logo;
    }
    if (files?.banner?.length) {
      updateEmployerDto.banner = await this.firebaseService.updateFileByUserId(files.banner[0], id, 'banner');
    } else if (updateEmployerDto?.banner) {
      delete updateEmployerDto.banner;
    }
    
    const data = await this.employersService.update(id, updateEmployerDto);
    return {
      message: 'Company updated successfully',
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employersService.remove(+id);
  }
}
