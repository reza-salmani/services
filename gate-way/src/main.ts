import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { printSchema } from 'graphql/utilities';
import { GraphQLSchemaHost } from '@nestjs/graphql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  if (process.env.NODE_ENV === 'production') {
    const { schema } = app.get(GraphQLSchemaHost);
    writeFileSync(join(process.cwd(), `/src/schema.gql`), printSchema(schema));
  }
}
bootstrap();
