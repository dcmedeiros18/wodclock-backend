import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  create(createClassDto: CreateClassDto) {
    return this.classRepository.save(createClassDto);
  }

  findAll() {
    return this.classRepository.find();
  }

  findOne(id: number) {
    return this.classRepository.findOneBy({ id });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.classRepository.update(id, updateClassDto);
  }

  remove(id: number) {
    return this.classRepository.delete(id);
  }
}
