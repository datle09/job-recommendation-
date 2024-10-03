import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AnotherDegreesService } from './another_degrees.service';
import { CreateAnotherDegreeDto, UpdateAnotherDegreeDto } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { ApiResponse } from 'src/shared/interfaces';
import { AnotherDegree } from './entities';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Another Degrees')
@Controller('another-degrees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnotherDegreesController {
  constructor(private readonly anotherDegreesService: AnotherDegreesService) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(
    @GetUser('userId') onlineProfileId: number,
    @Body() createAnotherDegreeDto: CreateAnotherDegreeDto,
  ): Promise<ApiResponse<AnotherDegree>> {
    const data = await this.anotherDegreesService.create(onlineProfileId, createAnotherDegreeDto);
    return {
      message: 'Another degree created successfully',
      statusCode: 201,
      data: data
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  async update(
    @GetUser('userId') onlineProfileId: number,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAnotherDegreeDto: UpdateAnotherDegreeDto
  ): Promise<ApiResponse<AnotherDegree>> {
    const data = await this.anotherDegreesService.update(onlineProfileId, id, updateAnotherDegreeDto);
    return {
      message: `Another degree id ${id} updated successfully`,
      statusCode: 200,
      data: data
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  async remove(
    @GetUser('userId') onlineProfileId: number,
    @Param('id', ParseIntPipe) id: number, 
  ): Promise<ApiResponse<AnotherDegree>> {
    const data = await this.anotherDegreesService.remove(onlineProfileId, id);
    return {
      message: `Another degree id ${id} deleted successfully`,
      statusCode: 200,
      data: data
    }
  }
}
