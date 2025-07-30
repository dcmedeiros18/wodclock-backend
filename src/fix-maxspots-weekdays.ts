import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function fixMaxSpotsWeekdays() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  // Update maxspots to 20 from Monday (1) to Friday (5)
  await db.run(`
    UPDATE class
    SET maxspots = 20
    WHERE CAST (strftime('%w', date) AS INTEGER) BETWEEN 1 AND 5
  `);

  // Show example of updated classes
  const result = await db.all(`SELECT date, time, maxspots FROM class WHERE CAST (strftime('%w', date) AS INTEGER) BETWEEN 1 AND 5 ORDER BY date, time LIMIT 10`);
  console.log('Example of Monday to Friday classes after update:');
  result.forEach(cls => {
    console.log(`${cls.date} - ${cls.time} - ${cls.maxspots} spots`);
  });

  await db.close();
  console.log('maxspots updated to 20 in all Monday to Friday classes!');
}

fixMaxSpotsWeekdays().catch(console.error); 