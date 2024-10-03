import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AttachedDocumentsService } from './attached_documents.service';
import { CreateAttachedDocumentDto, UpdateAttachedDocumentDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { UserRole } from 'src/shared/enums';
import { GetUser, Roles } from 'src/auth/decorator';
import { ApiResponse } from 'src/shared/interfaces';
import { AttachedDocument } from './entities';
import { DeleteResult } from 'typeorm';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Attached Documents')
@Controller('attached-documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttachedDocumentsController {
  constructor(
    private readonly attachedDocumentsService: AttachedDocumentsService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  async create(
      @GetUser('userId') id: number,
      @Body() createAttachedDocumentDto: CreateAttachedDocumentDto,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10*1024*1024 }),
            new FileTypeValidator({ fileType: 'application/pdf' }),
          ],
        }),
      ) file: Express.Multer.File,
  ): Promise<ApiResponse<AttachedDocument>> {
    if (!file) throw new BadRequestException('cv is required');
    createAttachedDocumentDto.cv = await this.firebaseService.updateFileByUserId(file, id, 'cv');

    const data = await this.attachedDocumentsService.create(id, createAttachedDocumentDto);
    return {
      message: 'attached Document created successfully',
      statusCode: 201,
      data: data
    }
  }
    
  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  async findOne(
    @GetUser('userId') id: number
  ): Promise<ApiResponse<AttachedDocument>> {
    const data = await this.attachedDocumentsService.findOne(id);
    return {
      message: 'Attached Document found',
      statusCode: 200,
      data: data
    }
  }
  
  @Patch('me')
  @Roles(UserRole.EMPLOYEE)
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  async update(
    @GetUser('userId') id: number, 
    @Body() updateAttachedDocumentDto: UpdateAttachedDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponse<AttachedDocument>> {
    if (file) {
      updateAttachedDocumentDto.cv = await this.firebaseService.updateFileByUserId(file, id, 'cv');
    } else if (updateAttachedDocumentDto?.cv) {
      delete updateAttachedDocumentDto.cv;
    }

    const data = await this.attachedDocumentsService.update(id, updateAttachedDocumentDto);
    return {
      message: 'Updated attached Document successfully',
      statusCode: 200,
      data: data
    }
  }
  
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<DeleteResult>> {
    const data = await this.attachedDocumentsService.remove(id);
    return {
      message: `Removed attached Document has id ${id} successfully`,
      statusCode: 200,
      data: data 
    }
  }
}

