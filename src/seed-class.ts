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
    date: '2025-07-10', // ✅ Fixed: string in expected format
    time: '18:00:00',    // ✅ Make sure to follow complete HH:MM:SS format
    maxspots: 20,
    wod_id: 1,           // ✅ Assuming this WOD already exists
    status: 'active',    // ✅ Recommended for consistency
  });

  await classRepository.save(classInstance);
  console.log('Initial class inserted successfully!');
  await AppDataSource.destroy();
}

seed();
