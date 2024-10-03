import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto';
import { User } from 'src/users/entities';
import { Response } from 'express';
import { ApiResponse } from 'src/shared/interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO): Promise<ApiResponse<User>> {
    const data = await this.authService.signup(signupDTO);
    return {
      message: 'Signup successful',
      statusCode: 201,
      data: data
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res() res: Response
  ) {
    const data = await this.authService.login(loginDTO, res);
    res.json({
      message: 'Login successful',
      statusCode: 200,
      data: data
    });
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.json({
      message: 'Logout successful',
      statusCode: 204,
    });
  }
}
