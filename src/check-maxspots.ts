import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function checkMaxSpots() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  const result = await db.all('SELECT id, date, time, maxspots FROM class ORDER BY date, time LIMIT 20');
  console.log('Exemplo de aulas:');
  result.forEach(cls => {
    console.log(`${cls.id} | ${cls.date} - ${cls.time} - maxspots: ${cls.maxspots}`);
  });

  await db.close();
}

checkMaxSpots().catch(console.error);