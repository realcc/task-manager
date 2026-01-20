import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    });
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
