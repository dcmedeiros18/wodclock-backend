import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt'; 
import { JwtStrategy } from './jwt.strategy';
import { Booking } from '../book/entities/book.entity';
import { BookController } from '../book/book.controller';
import { BookingsService } from '../book/book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking]),
    JwtModule.register({
      secret: 'jwt_secret_key', // depois coloque no .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, BookingsService],
  controllers: [AuthController, BookController],
  exports: [AuthService, BookingsService]
})
export class AuthModule {}