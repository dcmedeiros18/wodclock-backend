import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/, {
    message:
      'Password must have at least 6 characters, 1 uppercase letter, 1 number and 1 special character.'
  })
  newPassword: string;
}
