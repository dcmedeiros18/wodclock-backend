import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../validators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  emergencyContactName: string;

  @IsNotEmpty()
  emergencyContactPhone: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsEmail()
  @Match('email', { message: 'Emails do not match' })
  confirmEmail: string;

  @MinLength(6)
  password: string;

  @Match('password', {message: 'Password do not match'})
  confirmPassword: string;

  @IsNotEmpty()
  profile: string;
}
