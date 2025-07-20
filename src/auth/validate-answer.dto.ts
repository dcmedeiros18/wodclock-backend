import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateAnswerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  secretAnswer: string;
} 