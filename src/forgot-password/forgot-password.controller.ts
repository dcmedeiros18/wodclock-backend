import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForgotPasswordService, secretQuestions } from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { RecoverPasswordDto } from './recover-password.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  create(@Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    return this.forgotPasswordService.create(createForgotPasswordDto);
  }

  @Get()
  findAll() {
    return this.forgotPasswordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forgotPasswordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForgotPasswordDto: UpdateForgotPasswordDto) {
    return this.forgotPasswordService.update(+id, updateForgotPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forgotPasswordService.remove(+id);
  }

  @Post('/recover')
async recoverPassword(@Body() dto: RecoverPasswordDto) {
  return this.forgotPasswordService.recoverPassword(dto);
}

@Post('/validate-email')
  async getSecretQuestion(@Body() dto: ValidateEmailDto) {
    const question = await this.forgotPasswordService.getSecretQuestion(dto);
    return { question };
  }

  @Post('/validate-answer')
  async validateAnswer(@Body() dto: ValidateAnswerDto) {
    console.log('Dados recebidos:', dto);
    try {
      const isValid = await this.forgotPasswordService.validateSecretAnswer(dto);
      return { isValid };
    } catch (error) {
      console.error('Erro na validação:', error.message);
      throw error;
    }
  }

  @Post('/update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    const message = await this.forgotPasswordService.updatePassword(dto);
    return { message };
  }

  @Get('/questions')
getAvailableQuestions() {
  return { questions: secretQuestions };
}
}
