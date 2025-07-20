// src/auth/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../validators/match.decorator';

export class CreateUserDto {
  /**
   * User's first name - required and must be a string.
   */
  @IsNotEmpty()
  @IsString()
  firstName: string;

  /**
   * User's last name (surname) - required and must be a string.
   */
  @IsNotEmpty()
  @IsString()
  surname: string;

  /**
   * User's date of birth - required as a string (should be validated further at the controller/service level).
   */
  @IsNotEmpty()
  dateOfBirth: string;

  /**
   * User's phone number - required and must be a string.
   */
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  /**
   * Emergency contact name - required and must be a string.
   */
  @IsNotEmpty()
  @IsString()
  emergencyContactName: string;

  /**
   * Emergency contact phone number - required and must be a string.
   */
  @IsNotEmpty()
  @IsString()
  emergencyContactPhone: string;

  /**
   * User's email address - must be a valid email format.
   */
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email: string;

  /**
   * Email confirmation - must match the email field.
   */
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @Match('email', { message: 'Emails do not match.' })
  confirmEmail: string;

  /**
   * Password - must have at least 6 characters, 1 uppercase letter, 1 number, and 1 special character.
   */
  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
    {
      message:
        'Password must have at least 6 characters, contain 1 uppercase letter, 1 number, and 1 special character.',
    }
  )
  password: string;

  /**
   * Password confirmation - must match the password field.
   */
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match.' })
  confirmPassword: string;

  /**
   * User role/profile (e.g., user, admin, coach) - required field.
   */
  @IsNotEmpty()
  profile: string;

  /**
   * Secret question for password recovery - required.
   */
  @IsNotEmpty()
  secretQuestion: string;

  /**
   * Secret answer for password recovery - required.
   */
  @IsNotEmpty()
  secretAnswer: string;
}
