import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async book(classId: number, userId: number): Promise<{ message: string; booking?: Booking }> {
    // Verifica se já existe agendamento
    const existing = await this.bookingRepo.findOne({
      where: {
        user: { id: userId },
        class: { id: classId }
      },
      relations: ['class']
    });
    if (existing) {
      throw new BadRequestException(`You have already booked a class on ${existing.class?.date || ''} at ${existing.class?.time || ''}.`);
    }
    const booking = this.bookingRepo.create({
      user: { id: userId },
      class: { id: classId },
    });
    const saved = await this.bookingRepo.save(booking);
    // Buscar a aula para pegar data e hora
    const bookedClass = await this.bookingRepo.findOne({
      where: { id: saved.id },
      relations: ['class']
    });
    return {
      message: `Class successfully booked for ${bookedClass?.class?.date || ''} at ${bookedClass?.class?.time || ''}.`,
      booking: saved
    };
  }


  async getUserFrequency(userId: number, start: string, end: string): Promise<Booking[]> {
    const bookings = await this.bookingRepo.find({
      where: {
        user: { id: userId },
        status: 'active',
        class: {
          date: Between(new Date(start), new Date(end))
        }
      },
      relations: ['class']
    });
    // Filtrar para não contar aulas canceladas
    return bookings.filter(b => b.class?.status !== 'cancelled');
  }

  async findByUserId(userId: number, start?: string, end?: string) {
    const where: any = { user: { id: Number(userId) } };
    if (start && end) {
      where.class = { date: Between(new Date(start), new Date(end)) };
    }
    const bookings = await this.bookingRepo.find({
      where,
      relations: ['class'],
    });
    return bookings;
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
