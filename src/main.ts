import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:8100', 'http://localhost:8102'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // mostra os detalhes dos erros:
      disableErrorMessages: false
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
