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

  async findByUserId(userId: number) {
    console.log('ID RECEBIDO:', userId);
    const bookings = await this.bookingRepo.find({
      where: { user: { id: Number(userId) } }, // forçando número
      relations: ['class'],
    });
    console.log('BOOKINGS ENCONTRADOS:', bookings);
    return bookings;

    try {
      const bookings = await this.bookingRepo.find({
        where: { user: { id: Number(userId) } },
        relations: ['class'],
      });
      return bookings;
    } catch (err) {
      console.error('ERRO AO BUSCAR BOOKINGS:', err);
      throw new BadRequestException('Erro ao buscar reservas do usuário');
    }
    
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
