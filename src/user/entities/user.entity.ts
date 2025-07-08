import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
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

  @Column()
  profile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
