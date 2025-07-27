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

// ===== Database Configuration Function =====
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // PostgreSQL configuration for production environment
    return {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wodclock',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Never auto-sync schemas in production for safety
      logging: false, // Disable logging in production for performance
    };
  } else {
    // SQLite configuration for local development environment
    return {
      type: 'sqlite' as const,
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables in development
      logging: true, // Enable logging in development for debugging
    };
  }
};

@Module({
  imports: [
    // ===== Database configuration - SQLite for local, PostgreSQL for production =====
    TypeOrmModule.forRoot(getDatabaseConfig()),

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
