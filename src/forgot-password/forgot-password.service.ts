import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { RecoverPasswordDto } from './recover-password.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates or updates the secret question and hashed answer for a user.
   */
  async create(dto: CreateForgotPasswordDto): Promise<string> {
    console.log('Saving secret question/answer for:', dto.email);

    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Set secret question if provided
    if (dto.secretQuestion) {
      user.secretQuestion = dto.secretQuestion;
    }

    // Hash and save secret answer
    if (dto.secretAnswer) {
      const salt = await bcrypt.genSalt();
      user.secretAnswer = await bcrypt.hash(dto.secretAnswer, salt);
    }

    await this.userRepository.save(user);
    console.log('Secret question/answer successfully saved for:', dto.email);

    return 'Secret question and answer saved successfully';
  }

  /**
   * (Development) Returns placeholder message for all records.
   */
  findAll() {
    return `This action returns all forgotPassword`;
  }

  /**
   * (Development) Returns placeholder for a single forgot-password record.
   */
  findOne(id: number) {
    return `This action returns a #${id} forgotPassword`;
  }

  /**
   * Updates a forgot-password related user record by ID.
   */
  update(id: number, updateForgotPasswordDto: UpdateForgotPasswordDto) {
    return this.userRepository.update(id, updateForgotPasswordDto);
  }

  /**
   * Deletes a forgot-password related user record by ID.
   */
  remove(id: number) {
    return this.userRepository.delete(id);
  }

  /**
   * Full password recovery: validates email and answer, then resets password.
   */
  async recoverPassword(dto: RecoverPasswordDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (
      !user.secretAnswer ||
      user.secretAnswer.toLowerCase() !== dto.secretAnswer.toLowerCase()
    ) {
      throw new BadRequestException('Incorrect secret answer');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return 'Password updated successfully';
  }

  /**
   * Retrieves the saved secret question for a given user email.
   */
  async getSecretQuestion(dto: ValidateEmailDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.secretQuestion;
  }

  /**
   * Validates the user's answer to the secret question.
   */
  async validateSecretAnswer(dto: ValidateAnswerDto): Promise<boolean> {
    console.log('Validating secret answer for:', dto.email);

    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      console.log('User not found:', dto.email);
      throw new BadRequestException('User not found');
    }

    if (!user.secretAnswer) {
      console.log('No secret answer configured for user:', dto.email);
      throw new BadRequestException('No secret answer found for this user');
    }

    // Compare the provided answer with the hashed value
    const isValid = await bcrypt.compare(dto.secretAnswer.trim(), user.secretAnswer);
    console.log('Validation result:', isValid);

    return isValid;
  }

  /**
   * Updates the user's password after successful answer validation.
   */
  async updatePassword(dto: UpdatePasswordDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('User not found');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    return 'Password updated successfully';
  }
}

/**
 * Predefined list of available secret questions.
 */
export const secretQuestions = [
  "What is your favorite color?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite food?",
  "What is your mother's maiden name?"
];
