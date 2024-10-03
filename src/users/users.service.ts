import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto';
import { UserRole } from 'src/shared/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(data: LoginDTO): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .addSelect('user.password')
      .where('user.email = :email', {email: data.email})
      .getOne()
    if (!user) {
      throw new UnauthorizedException('Cound not find user');
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      const newUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(newUser);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Delete admin is not allowed');
    } 
    return this.userRepository.remove(user);
  }

  async findAll(options: IPaginationOptions, query: UserQueryDto): Promise<Pagination<User>>{
    // TODO: implement query buider
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')

    const { role, name, address, sex } = query;
    if (role) {
      queryBuilder.andWhere('user.role = :role', {role})
    }
    if (name) {
      queryBuilder.andWhere('user.name LIKE :name', {name: `%${name}%`})
    }
    if (address) {
      queryBuilder.andWhere('user.address LIKE :address', {address: `%${address}%`})
    }
    if (sex) {
      queryBuilder.andWhere('user.sex = :sex', {sex})
    }

    return paginate<User>(queryBuilder, options);
  }
}
