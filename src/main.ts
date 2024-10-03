import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './all.exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter} = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const documentBuilderConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Majors')
    .setDescription('Majors API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));

}
bootstrap();
