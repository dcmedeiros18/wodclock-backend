import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../book/entities/book.entity';

@Entity()
export class User {
  /**
   * One-to-many relationship: A user can have multiple bookings.
   */
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  /**
   * Primary key: Auto-generated unique user ID.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User's first name.
   */
  @Column({ name: 'first_name' })
  firstName: string;

  /**
   * User's surname (last name).
   */
  @Column({ name: 'surname' })
  surname: string;

  /**
   * User's date of birth.
   */
  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  /**
   * Name of emergency contact person.
   */
  @Column({ name: 'emergency_contact_name' })
  emergencyContactName: string;

  /**
   * Emergency contact's phone number.
   */
  @Column({ name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  /**
   * User's phone number.
   */
  @Column({ name: 'phone_number' })
  phoneNumber: string;

  /**
   * User's email (must be unique).
   */
  @Column({ unique: true })
  email: string;

  /**
   * Email confirmation field.
   */
  @Column({ name: 'confirm_email' })
  confirmEmail: string;

  /**
   * Encrypted password.
   */
  @Column()
  password: string;

  /**
   * Password confirmation field (stored encrypted as well).
   */
  @Column({ name: 'confirm_password' })
  confirmPassword: string;

  /**
   * User profile/role: can be 'admin', 'coach', or 'membership'.
   */
  @Column()
  profile: string;

  /**
   * Auto-generated timestamp when the user was created.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Secret question used for password recovery (optional).
   */
  @Column({ nullable: true })
  secretQuestion: string;

  /**
   * Secret answer (encrypted) used for password recovery (optional).
   */
  @Column({ nullable: true })
  secretAnswer: string;
}
