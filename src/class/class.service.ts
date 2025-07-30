import { Injectable, BadRequestException } from '@nestjs/common';
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

  async create(createClassDto: CreateClassDto) {
    const { date, time } = createClassDto;

    // Use string to check if class already exists at same date and time
    const exists = await this.classRepository.findOne({ where: { date, time } });

    if (exists) {
      throw new BadRequestException('Class already exists at this date and time.');
    }

    return this.classRepository.save(createClassDto);
  }

  findAll() {
    return this.classRepository.find();
  }

  async findByDate(date: string, userId?: number) {
    try {
      // Check if string is in correct format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }

      // Search by exact date (no BETWEEN, no Date)
      const classes = await this.classRepository.find({
        where: {
          date: date // keep as string, compatible with entity
        },
        relations: ['bookings', 'bookings.user'],
        order: {
          time: 'ASC'
        }
      });

      // Process return including status, remaining spots and if user already booked
      return classes.map(cls => ({
        ...cls,
        spotsLeft: cls.maxspots - (cls.bookings?.length || 0),
        alreadyBooked: cls.bookings?.some(b => b.user?.id === userId) || false,
        cancelled: cls.status === 'cancelled'
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
