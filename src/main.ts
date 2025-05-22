import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IEnvService, ENV_SERVICE } from './infrastructure/config/environment/env-service.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE'],
  });
 
  app.useLogger(app.get(Logger));
  app.flushLogs();

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Transaction Statistics API')
    .setDescription('API for managing transactions and their statistics.')
    .setVersion('1.0')
    .addTag('transactions')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const envService = app.get<IEnvService>(ENV_SERVICE);

  const port = envService.api.port;

  await app.listen(port);
  app.get(Logger).log(`Application is running on port: ${port}`);
}
bootstrap();