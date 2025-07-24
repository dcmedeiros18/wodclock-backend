import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Booking } from '../book/entities/book.entity';
import { BookController } from '../book/book.controller';
import { BookService } from '../book/book.service';

@Module({
  imports: [
    // Registers the User and Booking entities for dependency injection
    TypeOrmModule.forFeature([User, Booking]),

    // JWT configuration 
    JwtModule.register({
      secret: 'jwt_secret_key', 
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],

  // Service and strategy providers
  providers: [
    AuthService,
    JwtStrategy,
    BookService, 
  ],

  // Controllers for handling routes
  controllers: [
    AuthController,
    BookController, 
  ],

  // Exporting services for usage in other modules
  exports: [
    AuthService,
    BookService
  ],
})
export class AuthModule {}
