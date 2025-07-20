import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ===== Create a new user =====
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    // Generate a salt and hash the password before saving to the database
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    
    // If the user provided a secret answer, hash it before saving
    if (createUserDto.secretAnswer) {
      user.secretAnswer = await bcrypt.hash(createUserDto.secretAnswer, salt);
    }

    // Save the secret question if provided
    if (createUserDto.secretQuestion) {
      user.secretQuestion = createUserDto.secretQuestion;
    }

    try {
      // Save the new user to the database
      return await this.userRepository.save(user);
    } catch (error) {
      // Handle unique constraint violation (email already exists)
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Email already exists');
      }
      // Throw generic internal server error if something goes wrong
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // ===== Return all users from the database =====
  findAll() {
    return this.userRepository.find();
  }

  // ===== Return a single user by ID =====
  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // ===== Update a user's data by ID =====
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // ===== Delete a user by ID =====
  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
