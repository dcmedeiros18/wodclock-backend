import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { secretQuestions } from './forgot-password/forgot-password.service';

async function seed() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  // // Clear user table
  // await db.run('DELETE FROM user');

  // // Admin User
  // await db.run(`
  //   INSERT INTO user (first_name, surname, date_of_birth, emergency_contact_name, emergency_contact_phone, phone_number, email, confirm_email, password, confirm_password, profile, created_at)
  //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  // `, [
  //   'João',
  //   'Silva',
  //   '1990-01-01',
  //   'Maria Silva',
  //   '11999999999',
  //   '11888888888',
  //   'joao.silva@email.com',
  //   'joao.silva@email.com',
  //   'senha123',
  //   'senha123',
  //   'admin',
  //   new Date().toISOString()
  // ]);

  // Coach User
  await db.run(`
    INSERT INTO user (first_name, surname, date_of_birth, emergency_contact_name, emergency_contact_phone, phone_number, email, confirm_email, password, confirm_password, profile, created_at,secretQuestion,secretAnswer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Coach',
    'O\'Connor',
    '1985-05-15',
    'Bridget O\'Connor',
    '11977777777',
    '11666666666',
    'coach@email.com',
    'coach@email.com',
    'senha123@',
    'senha123@',
    'coach',
    new Date().toISOString(),
    'What is the name of your first pet?',
    'Test'
  ]);

  //   // Membership User
//   await db.run(`
//     INSERT INTO user (first_name, surname, date_of_birth, emergency_contact_name, emergency_contact_phone, phone_number, email, confirm_email, password, confirm_password, profile, created_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `, [
//     'Siobhan',
//     'Murphy',
//     '1992-08-20',
//     'Patrick Murphy',
//     '11555555555',
//     '11444444444',
//     'siobhan.murphy@email.com',
//     'siobhan.murphy@email.com',
//     'senha123',
//     'senha123',
//     'membership',
//     new Date().toISOString()
//   ]);

  console.log('Users inserted successfully!');
  await db.close();
}

seed(); 