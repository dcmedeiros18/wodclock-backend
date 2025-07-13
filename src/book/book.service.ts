import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async book(classId: number, userId: number): Promise<Booking> {
    const booking = this.bookingRepo.create({
      user: { id: userId },
      class: { id: classId },
    });

    return this.bookingRepo.save(booking);
  }


  async getUserFrequency(userId: number, start: string, end: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: {
        user: { id: userId },
        class: {
          date: Between(new Date(start), new Date(end))
        }
      },
      relations: ['class']
    });
  }

  findAll() {
    return this.bookingRepo.find();
  }

  findOne(id: number) {
    return this.bookingRepo.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const updateData: any = {};
    if (updateBookDto.classId) {
      updateData.class = { id: updateBookDto.classId };
    }
    if (updateBookDto.userId) {
      updateData.user = { id: updateBookDto.userId };
    }
    return this.bookingRepo.update(id, updateData);
  }

  remove(id: number) {
    return this.bookingRepo.delete(id);
  }
}
