import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Class } from '../../class/entities/class.entity';

@Entity('book')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings, { eager: false })
user: User;

  @ManyToOne(() => Class)
  class: Class;

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];


  @CreateDateColumn()
  created_at: Date;
}
