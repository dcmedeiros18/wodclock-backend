import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async findByDate(date: string, userId?: number) {
    try {
      // Validar formato da data
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Data inválida. Use o formato YYYY-MM-DD');
      }
      
      // Converter a data para o formato correto
      const targetDate = new Date(date + 'T00:00:00');
      if (isNaN(targetDate.getTime())) {
        throw new Error('Data inválida');
      }
      
      // Usar query mais eficiente com TypeORM
      const startDate = new Date(targetDate);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);
      
      const classes = await this.classRepository.find({
        where: {
          date: Between(startDate, endDate)
        },
        relations: ['bookings'],
        order: {
          time: 'ASC'
        }
      });
      
      return classes;
    } catch (error) {
      console.error('Error in findByDate:', error);
      throw error;
    }
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
