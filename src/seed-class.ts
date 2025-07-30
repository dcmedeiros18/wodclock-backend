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
    date: '2025-07-10', // ✅ Corrigido: string no formato esperado
    time: '18:00:00',    // ✅ Certifique-se de seguir o formato completo HH:MM:SS
    maxspots: 20,
    wod_id: 1,           // ✅ Assumindo que esse WOD já existe
    status: 'active',    // ✅ Recomendado para consistência
  });

  await classRepository.save(classInstance);
  console.log('Aula inicial inserida com sucesso!');
  await AppDataSource.destroy();
}

seed();
