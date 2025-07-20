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

  async create(dto: CreateForgotPasswordDto): Promise<string> {
    console.log('Salvando secret question/answer para:', dto.email);
    
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Salvar a pergunta secreta
    if (dto.secretQuestion) {
      user.secretQuestion = dto.secretQuestion;
    }

    // Hash e salvar a resposta secreta
    if (dto.secretAnswer) {
      const salt = await bcrypt.genSalt();
      user.secretAnswer = await bcrypt.hash(dto.secretAnswer, salt);
    }

    await this.userRepository.save(user);
    console.log('Secret question/answer salvas com sucesso para:', dto.email);
    
    return 'Secret question and answer saved successfully';
  }

  findAll() {
    return `This action returns all forgotPassword`;
  }

  findOne(id: number) {
    return `This action returns a #${id} forgotPassword`;
  }

  update(id: number, updateForgotPasswordDto: UpdateForgotPasswordDto) {
    return this.userRepository.update(id, updateForgotPasswordDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async recoverPassword(dto: RecoverPasswordDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
  
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    if (!user.secretAnswer || user.secretAnswer.toLowerCase() !== dto.secretAnswer.toLowerCase()) {
      throw new BadRequestException('Incorrect secret answer');
    }
  
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  
    return 'Password updated successfully';
  }

  async getSecretQuestion(dto: ValidateEmailDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new BadRequestException('User not found');
  }
    return user.secretQuestion; // deve estar salvo no banco
  }

  async validateSecretAnswer(dto: ValidateAnswerDto): Promise<boolean> {
    console.log('Validando resposta secreta para:', dto.email);
    
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      console.log('Usuário não encontrado:', dto.email);
      throw new BadRequestException('User not found');
    }
    
    if (!user.secretAnswer) {
      console.log('Usuário sem resposta secreta:', dto.email);
      throw new BadRequestException('No secret answer found for this user');
    }
    
    // Comparar a resposta fornecida com a resposta hasheada no banco
    const isValid = await bcrypt.compare(dto.secretAnswer.trim(), user.secretAnswer);
    console.log('Resultado da validação:', isValid);
    
    return isValid;
  }

  async updatePassword(dto: UpdatePasswordDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('User not found');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    return 'Password updated successfully';
  }
}

export const secretQuestions = [
  "What is your favorite color?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite food?",
  "What is your mother's maiden name?"
];