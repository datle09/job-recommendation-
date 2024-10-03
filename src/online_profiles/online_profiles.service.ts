import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOnlineProfileDto, UpdateOnlineProfileDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineProfile } from './entities';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class OnlineProfilesService {
  constructor(
    @InjectRepository(OnlineProfile)
    private onlineProfileRepository: Repository<OnlineProfile>
  ) {}

  async isUserIdExists(userId: number): Promise<boolean> {
    const resource = await this.onlineProfileRepository.findOneBy({userId: userId});
    return !!resource;
  }

  async create(id: number, createOnlineProfileDto: CreateOnlineProfileDto): Promise<OnlineProfile> {
    const isUserIdExists = await this.isUserIdExists(id);
    if (isUserIdExists) {
      throw new ConflictException(`Online profile has userId ${id} already exists`);
    }
    const newOnlineProfile = this.onlineProfileRepository.create({...createOnlineProfileDto, userId: id});
    const online_profile = await this.onlineProfileRepository.save(newOnlineProfile);
    return online_profile;
  }

  findAll() {
    return `This action returns all onlineProfiles`;
  }

  async findOne(id: number): Promise<OnlineProfile> {
    const onlineProfile = await this.onlineProfileRepository.findOne({
      where: {userId: id},
      relations: ['another_degrees', 'education_informations', 'work_experiences']
    });
    if (!onlineProfile) {
      throw new NotFoundException('Online profile not found');
    }
    return onlineProfile;
  }

  async update(id: number, updateOnlineProfileDto: UpdateOnlineProfileDto): Promise<OnlineProfile> {
    const onlineProfile = await this.findOne(id);
    Object.assign(onlineProfile, updateOnlineProfileDto);
    return this.onlineProfileRepository.save(onlineProfile);   
  }

  async remove(id: number): Promise<DeleteResult> {
    const onlineProfile = await this.findOne(id);
    return this.onlineProfileRepository.delete({userId: onlineProfile.userId});
  }
}
