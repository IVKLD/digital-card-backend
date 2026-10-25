import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { Request, Response } from 'express';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfileModule } from './modules/profile/profile.module';
import { createProfileDataLoaders } from './modules/profile/loaders/profile.loaders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        path: '/graphql',
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        context: ({ req, res }: { req: Request; res: Response }) => ({
          req,
          res,
          loaders: createProfileDataLoaders(prisma),
        }),
      }),
    }),
    ProfileModule,
  ],
})
export class AppModule {}
