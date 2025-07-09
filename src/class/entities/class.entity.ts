import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Wod } from '../../wod/entities/wod.entity';

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

  @ManyToOne(() => Wod)
  @JoinColumn({ name: 'wod_id' })
  wod: Wod;

  @Column()
  wod_id: number;
}
