import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function seedClasses() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  // Limpar tabela class
  await db.run('DELETE FROM class');

  // Horários de segunda a sexta
  const weekdays = [
    { time: '06:00', maxspots: 20 },
    { time: '07:00', maxspots: 20 },
    { time: '08:00', maxspots: 20 },
    { time: '17:00', maxspots: 20 },
    { time: '18:00', maxspots: 20 },
    { time: '19:00', maxspots: 20 },
    { time: '20:00', maxspots: 20 }
  ];

  // Horário de sábado
  const saturday = [
    { time: '09:00', maxspots: 40 }
  ];

  // Gerar datas de 16 de julho a 16 de agosto de 2025
  const startDate = new Date('2025-07-16');
  const endDate = new Date('2025-08-16');
  
  let currentDate = new Date(startDate);
  let classId = 1;

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Pular domingos
    if (dayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Escolher horários baseado no dia da semana
    const schedules = dayOfWeek === 6 ? saturday : weekdays; // 6 = sábado

    for (const schedule of schedules) {
      const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      await db.run(`
        INSERT INTO class (id, date, time, maxspots, wod_id)
        VALUES (?, ?, ?, ?, ?)
      `, [
        classId,
        dateStr,
        schedule.time,
        schedule.maxspots,
        1 // wod_id padrão
      ]);

      classId++;
    }

    // Avançar para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log('Aulas geradas com sucesso!');
  console.log(`Total de aulas criadas: ${classId - 1}`);
  
  // Mostrar algumas aulas criadas como exemplo
  const sampleClasses = await db.all('SELECT * FROM class ORDER BY date, time LIMIT 10');
  console.log('\nExemplos de aulas criadas:');
  sampleClasses.forEach(cls => {
    console.log(`${cls.date} - ${cls.time} - ${cls.maxspots} lugares`);
  });

  await db.close();
}

seedClasses().catch(console.error);