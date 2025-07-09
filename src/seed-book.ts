import { DataSource } from 'typeorm';
import { Book } from './book/entities/book.entity';
import { User } from './user/entities/user.entity';
import { Class } from './class/entities/class.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Book, User, Class],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const bookRepository = AppDataSource.getRepository(Book);

  const book = bookRepository.create({
    user_id: 1, // Assumindo que já existe um usuário com id 1
    class_id: 1, // Assumindo que já existe uma aula com id 1
  });

  await bookRepository.save(book);
  console.log('Reserva inicial inserida com sucesso!');
  await AppDataSource.destroy();
}

seed(); 