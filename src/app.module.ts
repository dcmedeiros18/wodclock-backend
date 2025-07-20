import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ===== Application Controller and Service =====
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ===== Application Modules =====
import { UserModule } from './user/user.module';
import { WodModule } from './wod/wod.module';
import { ClassModule } from './class/class.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';

@Module({
  imports: [
    // ===== Database configuration using SQLite =====
    TypeOrmModule.forRoot({
      type: 'sqlite', // Using SQLite as the database
      database: 'database.sqlite', // SQLite file name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load all entities
      synchronize: true, // Auto-create tables (use only in development)
    }),

    // ===== Application feature modules =====
    AuthModule,
    UserModule,
    WodModule,
    ClassModule,
    BookModule,
    ForgotPasswordModule,
  ],
  controllers: [AppController], // Main controller for the root route
  providers: [AppService],      // Main application service
})
export class AppModule {}
