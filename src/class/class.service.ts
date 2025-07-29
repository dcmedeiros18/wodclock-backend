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

  async create(createClassDto: CreateClassDto) {
    const { date, time } = createClassDto;
  
    // Verifica se já existe uma aula com a mesma data e horário
    const existingClass = await this.classRepository.findOne({
      where: { date: new Date(date), time }
    });
  
    if (existingClass) {
      throw new Error('A class already exists at this date and time.');
    }
  
    return this.classRepository.save(createClassDto);
  }
  

  findAll() {
    return this.classRepository.find();
  }

  async findByDate(date: string, userId?: number) {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Data inválida. Use o formato YYYY-MM-DD');
      }
  
      const targetDate = new Date(date + 'T00:00:00');
      if (isNaN(targetDate.getTime())) {
        throw new Error('Data inválida');
      }
  
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
  
      return classes.map(cls => ({
        ...cls,
        spotsLeft: cls.maxspots - (cls.bookings?.length || 0),
        alreadyBooked: cls.bookings?.some(b => b.user?.id === userId) || false,
        cancelled: cls.status === 'cancelled' // <- ESSENCIAL: define a flag "cancelled" para o front
      }));
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
