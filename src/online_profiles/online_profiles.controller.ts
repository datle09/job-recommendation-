import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OnlineProfilesService } from './online_profiles.service';
import { CreateOnlineProfileDto, UpdateOnlineProfileDto } from './dto';
import { ApiResponse } from 'src/shared/interfaces';
import { OnlineProfile } from './entities';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { DeleteResult } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Online profiles')
@Controller('online-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OnlineProfilesController {
  constructor(private readonly onlineProfilesService: OnlineProfilesService) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(
    @GetUser('userId') id: number,
    @Body() createOnlineProfileDto: CreateOnlineProfileDto
  ): Promise<ApiResponse<OnlineProfile>> {
    const data = await this.onlineProfilesService.create(id, createOnlineProfileDto);
    return {
      message: 'Online profile created successfully',
      statusCode: 201,
      data: data
    }
  }

  @Get()
  findAll() {
    return this.onlineProfilesService.findAll();
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  async findOne(
    @GetUser('userId') id: number
  ): Promise<ApiResponse<OnlineProfile>> {
    const data = await this.onlineProfilesService.findOne(id);
    return {
      message: 'Online profile found',
      statusCode: 200,
      data: data
    }
  }

  @Patch('me')
  async update(
    @GetUser('userId') id: number, 
    @Body() updateOnlineProfileDto: UpdateOnlineProfileDto
  ): Promise<ApiResponse<OnlineProfile>> {
    const data = await this.onlineProfilesService.update(id, updateOnlineProfileDto);
    return {
      message: 'Updated online profile successfully',
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<DeleteResult>> {
    const data = await this.onlineProfilesService.remove(id);
    return {
      message: `Removed online profile has id ${id} successfully`,
      statusCode: 200,
      data: data 
    }
  }
}
