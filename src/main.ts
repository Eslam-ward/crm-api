import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { setupSwagger } from './config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix('api/v1');
   useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
     transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);
// Enable CORS for all origins (you can customize this for production)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });







  setupSwagger(app);
   
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
