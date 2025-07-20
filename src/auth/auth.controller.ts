import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';
import { UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ValidateAnswerDto } from './validate-answer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
  
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('validate-email')
  async validateEmail(@Body() body: { email: string }) {
    return this.authService.validateEmail(body.email);
  }

  @Post('validate-answer')
  async validateAnswer(@Body() dto: ValidateAnswerDto) {
    console.log('Dados recebidos no validate-answer:', dto);
    console.log('Email:', dto.email);
    console.log('SecretAnswer:', dto.secretAnswer);
    return this.authService.validateAnswer(dto.email, dto.secretAnswer);
  }

  @Post('setup-secret')
  async setupSecret(@Body() body: { email: string; secretQuestion: string; secretAnswer: string }) {
    return this.authService.setupSecret(body.email, body.secretQuestion, body.secretAnswer);
  }

  @Post('get-secret-question')
  async getSecretQuestion(@Body() body: { email: string }) {
    return this.authService.getSecretQuestion(body.email);
  }
}