import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  secretQuestion?: string;

  @IsOptional()
  secretAnswer?: string;
}
