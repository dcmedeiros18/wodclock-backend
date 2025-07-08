import { DataSource } from 'typeorm';
import { Wod } from './wod/entities/wod.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Wod],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const wodRepository = AppDataSource.getRepository(Wod);

  const wod = wodRepository.create({
    title: 'WOD Fran',
    description: '21-15-9 reps for time: Thrusters (95/65 lb), Pull-Ups',
    date: new Date('2025-07-08'),
  });

  await wodRepository.save(wod);
  console.log('WOD inicial inserido com sucesso!');
  await AppDataSource.destroy();
}

seed(); 