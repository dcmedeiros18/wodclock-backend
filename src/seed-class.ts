import { DataSource } from 'typeorm';
import { Class } from './class/entities/class.entity';
import { Wod } from './wod/entities/wod.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Class, Wod],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const classRepository = AppDataSource.getRepository(Class);

  const classInstance = classRepository.create({
    date: new Date('2025-07-10'),
    time: '18:00',
    maxspots: 20,
    wod_id: 1, // Assumindo que já existe um WOD com id 1
  });

  await classRepository.save(classInstance);
  console.log('Aula inicial inserida com sucesso!');
  await AppDataSource.destroy();
}

seed(); 