import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // If you're using cookies or authorization headers
  });

  await app.listen(3000);
}
bootstrap();
