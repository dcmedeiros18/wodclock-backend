import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Wod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar' })
  date: String;
}
