import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function seedClasses() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  // Clear class table
  await db.run('DELETE FROM class');

  // Monday to Friday schedules
  const weekdays = [
    { time: '06:00', maxspots: 15 },
    { time: '07:00', maxspots: 15 },
    { time: '08:00', maxspots: 15 },
    { time: '17:00', maxspots: 15 },
    { time: '18:00', maxspots: 15 },
    { time: '19:00', maxspots: 15 },
    { time: '20:00', maxspots: 15 }
  ];

  // Saturday schedule
  const saturday = [
    { time: '09:00', maxspots: 26 }
  ];

  // Generate dates from July 16 to August 16, 2025
  const startDate = new Date('2025-07-16');
  const endDate = new Date('2025-08-16');
  
  let currentDate = new Date(startDate);
  let classId = 1;

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Skip Sundays
    if (dayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Choose schedules based on day of week
    const schedules = dayOfWeek === 6 ? saturday : weekdays; // 6 = Saturday

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
        1 // default wod_id
      ]);

      classId++;
    }

    // Advance to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log('Classes generated successfully!');
  console.log(`Total classes created: ${classId - 1}`);
  
  // Show some created classes as example
  const sampleClasses = await db.all('SELECT * FROM class ORDER BY date, time LIMIT 10');
  console.log('\nExample classes created:');
  sampleClasses.forEach(cls => {
    console.log(`${cls.date} - ${cls.time} - ${cls.maxspots} spots`);
  });

  await db.close();
}

seedClasses().catch(console.error);