import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { PoemsModule } from './poems/poems.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    CacheModule.register({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDISHOST!,
            port: process.env.REDISPORT
              ? parseInt(process.env.REDISPORT)
              : 6379,
          },
          url: process.env.REDIS_URL,
          password: process.env.REDISPASSWORD,
        });
        return {
          store: store as unknown as CacheStorage,
          ttl: 60 * 60 * 24 * 7,
        };
      },
    }),
    PrismaModule,
    JwtModule.register({}),
    AuthModule,
    WebsocketsModule,
    ChatModule,
    UserModule,
    PoemsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, JwtService],
})
export class AppModule {}
