import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  /**
   * Books a class for a given user.
   * Validates whether the user has already booked the same class.
   */
  async book(classId: number, userId: number): Promise<{ message: string; booking?: Booking }> {
    // Check if the user already has a booking for the same class
    const existing = await this.bookingRepo.findOne({
      where: {
        user: { id: userId },
        class: { id: classId }
      },
      relations: ['class']
    });

    if (existing) {
      throw new BadRequestException(
        `You have already booked a class on ${existing.class?.date || ''} at ${existing.class?.time || ''}.`
      );
    }

    // Create and save new booking
    const booking = this.bookingRepo.create({
      user: { id: userId },
      class: { id: classId },
    });

    const saved = await this.bookingRepo.save(booking);

    // Fetch class info to display date/time in confirmation
    const bookedClass = await this.bookingRepo.findOne({
      where: { id: saved.id },
      relations: ['class']
    });

    return {
      message: `Class successfully booked for ${bookedClass?.class?.date || ''} at ${bookedClass?.class?.time || ''}.`,
      booking: saved,
    };
  }

  /**
   * Returns a list of bookings made by a user within a given date range.
   * Only considers active bookings and non-cancelled classes.
   */
  async getUserFrequency(userId: number, start: string, end: string): Promise<Booking[]> {
    const bookings = await this.bookingRepo.find({
      where: {
        user: { id: userId },
        status: 'active',
        class: {
          date: Between(start, end)
        }
      },
      relations: ['class']
    });

    // Filter out classes that were cancelled
    return bookings.filter(b => b.class?.status !== 'cancelled');
  }

  /**
   * Returns bookings for a specific user.
   * Optionally filters by a date range.
   */
  async findByUserId(userId: number, start?: string, end?: string): Promise<Booking[]> {
    const where: any = { user: { id: Number(userId) } };

    if (start && end) {
      where.class = {
        date: Between(new Date(start), new Date(end))
      };
    }

    return this.bookingRepo.find({
      where,
      relations: ['class'],
    });
  }

  /**
   * Returns all bookings in the system.
   */
  findAll(): Promise<Booking[]> {
    return this.bookingRepo.find();
  }

  /**
   * Returns a specific booking by ID.
   */
  findOne(id: number): Promise<Booking | null> {
    return this.bookingRepo.findOneBy({ id });
  }

  /**
   * Updates an existing booking by ID.
   * Allows updating the user or class associated with the booking.
   */
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

  /**
   * Deletes a booking by ID.
   */
  remove(id: number) {
    return this.bookingRepo.delete(id);
  }
}
