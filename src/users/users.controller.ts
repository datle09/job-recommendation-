import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/shared/enums';
import { User } from './entities';
import { ApiResponse } from 'src/shared/interfaces';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Get('me')
  async getMe(
    @GetUser('userId') id: number
  ): Promise<ApiResponse<User>> {
      const data = await this.usersService.findOne(id);
      return {
        message: 'get my profile successful',
        statusCode: 200,
        data: data
      }
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async editMe(
    @GetUser('userId') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse<User>> {
    if (file) {
      updateUserDto.avatar = await this.firebaseService.updateFileByUserId(file, id, 'avatar');
    } else if (updateUserDto?.avatar) {
      delete updateUserDto.avatar;
    }

    const data = await this.usersService.update(id, updateUserDto);
    return {
      message: 'Update my profile successful',
      statusCode: 200,
      data: data
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<ApiResponse<User>> {
    const data = await this.usersService.create(createUserDto);
    return {
      message: 'User created',
      statusCode: 201,
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
    @Query()
    query: UserQueryDto
  ): Promise<ApiResponse<Pagination<User>>> {
    const options: IPaginationOptions = {
      page,
      limit: limit > 100 ? 100 : limit,
    };    
    const data = await this.usersService.findAll(options, query);
    return {
      message: 'find all users successfully',
      statusCode: 200,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse<User>> {
    if (file) {
      updateUserDto.avatar = await this.firebaseService.updateFileByUserId(file, id, 'avatar');
    } else if (updateUserDto?.avatar) {
      delete updateUserDto.avatar;
    }

    const data = await this.usersService.update(id, updateUserDto);
    return {
      message: 'Update user successful',
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ApiResponse<User>> {
    const data = await this.usersService.remove(id);
    return {
      message: 'User removed successfully',
      statusCode: 200,
      data: data
    }
  }
}
