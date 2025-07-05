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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
