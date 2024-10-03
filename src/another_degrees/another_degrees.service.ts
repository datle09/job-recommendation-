import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnotherDegreeDto, UpdateAnotherDegreeDto } from './dto';
import { OnlineProfilesService } from 'src/online_profiles/online_profiles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotherDegree } from './entities';
import { Repository } from 'typeorm';
import { OnlineProfile } from 'src/online_profiles/entities';

@Injectable()
export class AnotherDegreesService {
  constructor(
    private onlineProfileService: OnlineProfilesService,
    @InjectRepository(OnlineProfile)
    private onlineProfileRepository: Repository<OnlineProfile>,
    @InjectRepository(AnotherDegree)
    private anotherDegreeRepository: Repository<AnotherDegree>,
  ) {}

  async findOne(id: number): Promise<AnotherDegree> {
    const anotherDegree = await this.anotherDegreeRepository
      .createQueryBuilder('anotherDegree')
      .select(['anotherDegree', 'onlineProfile.userId'])
      .leftJoin('anotherDegree.online_profile','onlineProfile')
      .where('id = :id', {id})
      .getOne();

    if (!anotherDegree) {
      throw new NotFoundException('Another Degree not found');
    }
    return anotherDegree;
  }

  async validateOwnershipAndGetResource(
    onlineProfileId: number, 
    id: number, 
  ): Promise<AnotherDegree> {
    const anotherDegree = await this.findOne(id);
    if (anotherDegree.online_profile.userId !== onlineProfileId) {
      throw new ForbiddenException('You do not owner this Degree');
    }
    return anotherDegree;
  }

  async create(onlineProfileId: number, createAnotherDegreeDto: CreateAnotherDegreeDto): Promise<AnotherDegree> {
    const onlineProfile = await this.onlineProfileService.findOne(onlineProfileId);

    const newAnotherDegree = this.anotherDegreeRepository.create(createAnotherDegreeDto);
    const anotherDegree = await this.anotherDegreeRepository.save(newAnotherDegree);

    onlineProfile.another_degrees.push(anotherDegree);
    await this.onlineProfileRepository.save(onlineProfile);
    return anotherDegree;
  }

  async update(
    onlineProfileId: number, 
    id: number, 
    updateAnotherDegreeDto: UpdateAnotherDegreeDto,
  ): Promise<AnotherDegree> {
    const anotherDegree = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    Object.assign(anotherDegree, updateAnotherDegreeDto);
    return this.anotherDegreeRepository.save(anotherDegree);
  }

  async remove(
    onlineProfileId: number, 
    id: number, 
  ): Promise<AnotherDegree> {
    const anotherDegree = await this.validateOwnershipAndGetResource(onlineProfileId, id);
    return this.anotherDegreeRepository.remove(anotherDegree);
  }
}
