// src/auth/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../validators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactName: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactPhone: string;  

  @IsEmail()
  email: string;

  @IsEmail()
  confirmEmail: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/, {
    message: 'A senha deve ter no mínimo 6 caracteres, conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.'
  })
  password: string;

  @IsNotEmpty()
  @Match('password', { message: 'As senhas não coincidem.' })
  confirmPassword: string;

  @IsNotEmpty()
  profile: string;
}
