import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../book/entities/book.entity';

@Entity()
export class User {
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];


  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'surname' })
  surname: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'confirm_email' })
  confirmEmail: string;

  @Column()
  password: string;

  @Column({ name: 'confirm_password' })
  confirmPassword: string;

  //Adm , Coach , Membership
  @Column()
  profile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  secretQuestion: string;

  @Column({ nullable: true })
  secretAnswer: string; // será armazenada criptografada

}
