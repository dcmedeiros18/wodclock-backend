import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
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
    ){}

    async register(dto: CreateUserDto) {
      if (dto.email !== dto.confirmEmail) {
        throw new BadRequestException('Emails do not match');
      }
    
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        // Retorna apenas a mensagem simples, sem detalhes extras
        throw new BadRequestException('Email already registered');
      }
    
      const hashedPassword = await bcrypt.hash(dto.password, 10);
    
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
        confirmPassword: hashedPassword, // salva o mesmo hash
        profile: dto.profile,
      });
    
      const saved = await this.userRepository.save(user);
    
      return {
        id: saved.id,
        email: saved.email,
        profile: saved.profile,
        message: 'User successfully registered',
      };
    }

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
            surname: user.surname
          }
        };
      }
}
