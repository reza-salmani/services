import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaBuilderModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLSchemaBuilderModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true, // when use production mode it should be true otherwise false
    }),
  ],
})
export class GraphqlModule {}
