import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationInformationDto, UpdateEducationInformationDto } from './dto';
import { OnlineProfilesService } from 'src/online_profiles/online_profiles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineProfile } from 'src/online_profiles/entities';
import { Repository } from 'typeorm';
import { EducationInformation } from './entities';

@Injectable()
export class EducationInformationsService {
  constructor(
    private onlineProfileService: OnlineProfilesService,
    @InjectRepository(OnlineProfile)
    private onlineProfileRepository: Repository<OnlineProfile>,
    @InjectRepository(EducationInformation)
    private educationInformationRepository: Repository<EducationInformation>,
  ) {}

  async findOne(id: number): Promise<EducationInformation> {
    const educationInformation = await this.educationInformationRepository
      .createQueryBuilder('educationInformation')
      .select(['educationInformation', 'onlineProfile.userId'])
      .leftJoin('educationInformation.online_profile','onlineProfile')
      .where('id = :id', {id})
      .getOne();

    if (!educationInformation) {
      throw new NotFoundException('Education Information not found');
    }
    return educationInformation;
  }

  async validateOwnershipAndGetResource(
    onlineProfileId: number, 
    id: number, 
  ): Promise<EducationInformation> {
    const educationInformation = await this.findOne(id);
    if (educationInformation.online_profile.userId !== onlineProfileId) {
      throw new ForbiddenException('You do not owner this Education Information');
    }
    return educationInformation;
  }

  async create(onlineProfileId: number, createEducationInformationDto: CreateEducationInformationDto): Promise<EducationInformation> {
    const onlineProfile = await this.onlineProfileService.findOne(onlineProfileId);

    const newEducationInformation = this.educationInformationRepository.create(createEducationInformationDto);
    const educationInformation = await this.educationInformationRepository.save(newEducationInformation);

    onlineProfile.education_informations.push(educationInformation);
    await this.onlineProfileRepository.save(onlineProfile);
    return educationInformation;
  }

  async update(
    onlineProfileId: number, 
    id: number, 
    updateEducationInformationDto: UpdateEducationInformationDto
  ): Promise<EducationInformation> {
    const educationInformation = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    Object.assign(educationInformation, updateEducationInformationDto);
    return this.educationInformationRepository.save(educationInformation);
  }

  async remove(
    onlineProfileId: number, 
    id: number,
  ): Promise<EducationInformation> {
    const educationInformation = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    return this.educationInformationRepository.remove(educationInformation);
  }
}
