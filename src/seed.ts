import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
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

  await userRepository.save(user);
  console.log('Usuário inicial inserido com sucesso!');
  await AppDataSource.destroy();
}

seed(); 