import { IsEmail, IsString } from 'class-validator';

export class ValidateAnswerDto {
  @IsEmail()
  email: string;

  @IsString()
  secretAnswer: string;
}
