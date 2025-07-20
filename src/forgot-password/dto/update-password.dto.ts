import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

/**
 * DTO (Data Transfer Object) used for updating a user's password.
 * Validates the email and the new password according to business rules.
 */
export class UpdatePasswordDto {

  /**
   * The email of the user requesting a password reset.
   * Must be a valid email and cannot be empty.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The new password to be set.
   * Must:
   *  - Be at least 6 characters long
   *  - Contain at least one uppercase letter
   *  - Contain at least one number
   *  - Contain at least one special character
   */
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/, {
    message:
      'Password must have at least 6 characters, 1 uppercase letter, 1 number and 1 special character.'
  })
  newPassword: string;
}
