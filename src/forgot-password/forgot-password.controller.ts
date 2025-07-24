import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ForgotPasswordService,
  secretQuestions,
} from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { RecoverPasswordDto } from './recover-password.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

  /**
   * Creates a forgot-password record.
   * (This endpoint can be adapted or removed based on application needs.)
   */
  @Post()
  create(@Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    return this.forgotPasswordService.create(createForgotPasswordDto);
  }

  /**
   * Returns all records from forgot-password module.
   * (This is typically used only for development or admin purposes.)
   */
  @Get()
  findAll() {
    return this.forgotPasswordService.findAll();
  }

  /**
   * Returns a specific forgot-password record by ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format.');
    }
    return this.forgotPasswordService.findOne(numericId);
  }
  /**
   * Updates a forgot-password record by ID.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateForgotPasswordDto) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format.');
    }
    return this.forgotPasswordService.update(numericId, dto);
  }

  /**
   * Deletes a forgot-password record by ID.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format.');
    }
    return this.forgotPasswordService.remove(numericId);
  }

  /**
   * Step 1: Email validation - returns the secret question if email is valid.
   */
  @Post('/validate-email')
  async getSecretQuestion(@Body() dto: ValidateEmailDto) {
    const question = await this.forgotPasswordService.getSecretQuestion(dto);
    return { question };
  }

  /**
   * Step 2: Validates the user's answer to the secret question.
   */
  @Post('/validate-answer')
  async validateAnswer(@Body() dto: ValidateAnswerDto) {
    console.log('Received data:', dto);
    try {
      const isValid = await this.forgotPasswordService.validateSecretAnswer(dto);
      return { isValid };
    } catch (error) {
      console.error('Validation error:', error.message);
      throw error;
    }
  }

  /**
   * Step 3: Updates the user's password if email and answer are valid.
   */
  @Post('/update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    const message = await this.forgotPasswordService.updatePassword(dto);
    return { message };
  }

  /**
   * Returns the list of available predefined secret questions.
   */
  @Get('/questions')
  getAvailableQuestions() {
    return { questions: secretQuestions };
  }

  /**
   * Legacy or fallback endpoint for full recovery using a single DTO.
   * This combines email, answer, and new password in one call.
   */
  @Post('/recover')
  async recoverPassword(@Body() dto: RecoverPasswordDto) {
    return this.forgotPasswordService.recoverPassword(dto);
  }
}
