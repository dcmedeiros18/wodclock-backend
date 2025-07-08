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

  @Column({ name: 'emergency_contact_number' })
  emergencyContactNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  profile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
