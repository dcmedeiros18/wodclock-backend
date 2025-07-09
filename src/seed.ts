import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Wod } from './wod/entities/wod.entity';
import { Class } from './class/entities/class.entity';
import { Book } from './book/entities/book.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Wod, Class, Book],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  // Usuário
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    firstName: 'João',
    surname: 'Silva',
    dateOfBirth: new Date('1990-01-01'),
    emergencyContactName: 'Maria Silva',
    emergencyContactPhone: '11999999999',
    phoneNumber: '11888888888',
    email: 'joao.silva@email.com',
    confirmEmail: 'joao.silva@email.com',
    password: 'senha123',
    confirmPassword: 'senha123',
    profile: 'admin',
    createdAt: new Date(),
  });
  const savedUser = await userRepository.save(user);

  // WOD
  const wodRepository = AppDataSource.getRepository(Wod);
  const wod = wodRepository.create({
    title: 'WOD Fran',
    description: '21-15-9 reps for time: Thrusters (95/65 lb), Pull-Ups',
    date: new Date('2025-07-08'),
  });
  const savedWod = await wodRepository.save(wod);

  // Aula
  const classRepository = AppDataSource.getRepository(Class);
  const classInstance = classRepository.create({
    date: new Date('2025-07-10'),
    time: '18:00',
    maxspots: 20,
    wod_id: savedWod.id,
  });
  const savedClass = await classRepository.save(classInstance);

  // Reserva (Book)
  const bookRepository = AppDataSource.getRepository(Book);
  const book = bookRepository.create({
    user_id: savedUser.id,
    class_id: savedClass.id,
  });
  await bookRepository.save(book);

  console.log('Carga inicial inserida com sucesso!');
  await AppDataSource.destroy();
}

seed(); 