import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function fixMaxSpotsWeekdays() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  // Atualizar maxspots para 20 de segunda (1) a sexta (5)
  await db.run(`
    UPDATE class
    SET maxspots = 20
    WHERE CAST (strftime('%w', date) AS INTEGER) BETWEEN 1 AND 5
  `);

  // Mostrar exemplo de aulas atualizadas
  const result = await db.all(`SELECT date, time, maxspots FROM class WHERE CAST (strftime('%w', date) AS INTEGER) BETWEEN 1 AND 5 ORDER BY date, time LIMIT 10`);
  console.log('Exemplo de aulas de segunda a sexta após atualização:');
  result.forEach(cls => {
    console.log(`${cls.date} - ${cls.time} - ${cls.maxspots} lugares`);
  });

  await db.close();
  console.log('maxspots atualizado para 20 em todas as aulas de segunda a sexta!');
}

fixMaxSpotsWeekdays().catch(console.error); 