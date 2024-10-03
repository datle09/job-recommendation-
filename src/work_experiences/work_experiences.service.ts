import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkExperienceDto } from './dto/create-work_experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work_experience.dto';
import { OnlineProfilesService } from 'src/online_profiles/online_profiles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineProfile } from 'src/online_profiles/entities';
import { Repository } from 'typeorm';
import { WorkExperience } from './entities';

@Injectable()
export class WorkExperiencesService {
  constructor(
    private onlineProfileService: OnlineProfilesService,
    @InjectRepository(OnlineProfile)
    private onlineProfileRepository: Repository<OnlineProfile>,
    @InjectRepository(WorkExperience)
    private workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async findOne(id: number): Promise<WorkExperience> {
    const workExperience = await this.workExperienceRepository
      .createQueryBuilder('workExperience')
      .select(['workExperience', 'onlineProfile.userId'])
      .leftJoin('workExperience.online_profile','onlineProfile')
      .where('id = :id', {id})
      .getOne();

    if (!workExperience) {
      throw new NotFoundException('Work Experience not found');
    }
    return workExperience;
  }

  async validateOwnershipAndGetResource(
    onlineProfileId: number, 
    id: number, 
  ): Promise<WorkExperience> {
    const workExperience = await this.findOne(id);
    if (workExperience.online_profile.userId !== onlineProfileId) {
      throw new ForbiddenException('You do not owner this Work Experience');
    }
    return workExperience;
  }

  async create(onlineProfileId: number, createWorkExperienceDto: CreateWorkExperienceDto): Promise<WorkExperience> {
    const onlineProfile = await this.onlineProfileService.findOne(onlineProfileId);

    const newWorkExperience = this.workExperienceRepository.create(createWorkExperienceDto);
    const workExperience = await this.workExperienceRepository.save(newWorkExperience);

    onlineProfile.work_experiences.push(workExperience);
    await this.onlineProfileRepository.save(onlineProfile);
    return workExperience;
  }

  async update(
    onlineProfileId: number, 
    id: number, 
    updateWorkExperienceDto: UpdateWorkExperienceDto
  ): Promise<WorkExperience> {
    const workExperience = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    Object.assign(workExperience, updateWorkExperienceDto);
    return this.workExperienceRepository.save(workExperience);
  }

  async remove(
    onlineProfileId: number, 
    id: number
  ): Promise<WorkExperience> {
    const workExperience = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    return this.workExperienceRepository.remove(workExperience);
  }
}
