import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Booking } from '../../book/entities/book.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column()
  maxspots: number; 

  @OneToMany(() => Booking, booking => booking.class)
  bookings: Booking[];

  @Column()
  wod_id: number;
}
