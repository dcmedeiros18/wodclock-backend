import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDTO } from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user after validating email and password confirmation.
   * Password and secret answer are hashed before saving to the database.
   */
  async register(dto: CreateUserDto) {
    if (dto.email !== dto.confirmEmail) {
      throw new BadRequestException('Emails do not match');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const hashedSecretAnswer = await bcrypt.hash(dto.secretAnswer, 10);

    const user = this.userRepository.create({
      firstName: dto.firstName,
      surname: dto.surname,
      dateOfBirth: dto.dateOfBirth,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      confirmEmail: dto.confirmEmail,
      password: hashedPassword,
      confirmPassword: hashedPassword, 
      profile: dto.profile,
      secretQuestion: dto.secretQuestion,
      secretAnswer: hashedSecretAnswer,
    });

    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      email: saved.email,
      profile: saved.profile,
      message: 'User successfully registered',
    };
  }

  /**
   * Authenticates the user and returns a JWT token.
   * Validates user existence and compares the hashed password.
   */
  async login(loginDto: LoginDTO): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password.');
    }

    const payload = { sub: user.id, email: user.email, profile: user.profile };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        firstName: user.firstName,
        surname: user.surname,
      },
    };
  }

  /**
   * Checks if a given email exists in the database.
   */
  async validateEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return {
      exists: !!user,
      message: user ? 'Email found' : 'Email not found',
    };
  }

  /**
   * Validates the user's secret answer by comparing it with the stored hashed answer.
   */
  async validateAnswer(email: string, secretAnswer: string) {
    if (!email || !secretAnswer) {
      throw new BadRequestException('Email and secret answer are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.secretAnswer) {
      throw new UnauthorizedException('No secret answer configured');
    }

    try {
      const isValid = await bcrypt.compare(secretAnswer.trim(), user.secretAnswer);

      return {
        valid: isValid,
        message: isValid ? 'Answer is correct' : 'Answer is incorrect',
      };
    } catch (error) {
      console.error('bcrypt.compare error:', error);
      throw new BadRequestException('Invalid secret answer format');
    }
  }

  /**
   * Sets up the user's secret question and answer (hashed) for future password recovery.
   */
  async setupSecret(email: string, secretQuestion: string, secretAnswer: string) {
    if (!email || !secretQuestion || !secretAnswer) {
      throw new BadRequestException('Email, secret question and secret answer are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    try {
      const hashedAnswer = await bcrypt.hash(secretAnswer.trim(), 10);
      user.secretQuestion = secretQuestion.trim();
      user.secretAnswer = hashedAnswer;

      await this.userRepository.save(user);

      return {
        message: 'Secret question and answer configured successfully',
      };
    } catch (error) {
      console.error('Error while configuring secret:', error);
      throw new BadRequestException('Failed to configure secret question and answer');
    }
  }

  /**
   * Returns the configured secret question for the given email.
   */
  async getSecretQuestion(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.secretQuestion) {
      throw new UnauthorizedException('No secret question configured');
    }

    return {
      secretQuestion: user.secretQuestion,
    };
  }
}
