import { Controller, Post, Body, UnauthorizedException, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ValidateAnswerDto } from './validate-answer.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * === LOGIN ===
   * Authenticates a user and returns a JWT token + user info.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  /**
   * === GET CURRENT LOGGED USER PROFILE ===
   * Returns the authenticated user's data from JWT.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * === REGISTER USER ===
   * Registers a new user in the system with basic info and secret question.
   */
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  /**
   * === VALIDATE EMAIL (FORGOT PASSWORD STEP 1) ===
   * Verifies if the email exists in the system and returns the related secret question.
   */
  @Post('validate-email')
  async validateEmail(@Body() body: { email: string }) {
    return this.authService.validateEmail(body.email);
  }

  /**
   * === VALIDATE SECRET ANSWER (FORGOT PASSWORD STEP 2) ===
   * Confirms if the user provided the correct answer to the stored secret question.
   */
  @Post('validate-answer')
  async validateAnswer(@Body() dto: ValidateAnswerDto) {
    console.log('Received data for validate-answer:', dto);
    console.log('Email:', dto.email);
    console.log('SecretAnswer:', dto.secretAnswer);
    return this.authService.validateAnswer(dto.email, dto.secretAnswer);
  }

  /**
   * === SETUP SECRET QUESTION & ANSWER ===
   * Allows a user to define their secret question and answer for future password recovery.
   */
  @Post('setup-secret')
  async setupSecret(@Body() body: { email: string; secretQuestion: string; secretAnswer: string }) {
    return this.authService.setupSecret(body.email, body.secretQuestion, body.secretAnswer);
  }

  /**
   * === GET ONLY SECRET QUESTION BY EMAIL ===
   * Returns the stored secret question for a given email (without checking the answer).
   */
  @Post('get-secret-question')
  async getSecretQuestion(@Body() body: { email: string }) {
    return this.authService.getSecretQuestion(body.email);
  }
}
