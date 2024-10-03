import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO, SignupDTO } from './dto';
import { User } from 'src/users/entities';
import { UserRole } from 'src/shared/enums';
import { CreateUserDto } from 'src/users/dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './types';
import { CookieOptions, Response } from 'express';
import { EmployeesService } from 'src/employees/employees.service';
import { EmployersService } from 'src/employers/employers.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private employeeService: EmployeesService,
    private employerService: EmployersService,
    private jwtService: JwtService,
  ) {}
  async signup(signupDTO: SignupDTO): Promise<User> {
    const { password, confirmPassword, role } =  signupDTO;
    if (password !== confirmPassword ) {
      throw new BadRequestException('password does not match confirmPassword');
    }

    if (role === UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to create an admin account')
    }

    delete signupDTO.confirmPassword;
    const createUserDto: CreateUserDto = signupDTO;
    const user = await this.userService.create(createUserDto);
    
    if (role === UserRole.EMPLOYEE) {
      await this.employeeService.create({userId: user.userId});
    }
    if (role === UserRole.EMPLOYER) {
      await this.employerService.create({userId: user.userId});
    }

    return user;
  }

  async login( 
    loginDTO: LoginDTO,
    res: Response
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password
    );
    if (passwordMatched) {
      const payload: PayloadType = { userId: user.userId, email: user.email, role: user.role};

      const jwtToken = this.jwtService.sign(payload);
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 100,
        // secure: true, // Yêu cầu kết nối bảo mật (HTTPS)
      };
      res.cookie('jwt', jwtToken, cookieOptions);
      return { accessToken: jwtToken };
    } else {
      throw new UnauthorizedException("Password does not match");
    }
  }
}
