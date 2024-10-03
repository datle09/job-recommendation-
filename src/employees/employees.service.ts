import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmployeesService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    const employee = await this.employeeRepository.save(newEmployee);
    return employee;
  }

  findAll() {
    return `This action returns all employees`;
  }

  async getProfile(id: number) {
    const user = await this.userService.findOne(id);
    const employee = await this.employeeRepository.findOneBy({userId: id});
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return {
      ...user,
      ...employee,
    };
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const saveEmployee = await this.employeeRepository.findOneBy({userId: id});
    if ('isMarried' in updateEmployeeDto) {
      saveEmployee.isMarried = updateEmployeeDto.isMarried;
      await saveEmployee.save();
      delete updateEmployeeDto.isMarried;
    }

    let updateUserDto: UpdateUserDto = updateEmployeeDto;
    const saveUser = await this.userService.update(id, updateUserDto);
    return {
      ...saveUser,
      ...saveEmployee
    };
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
