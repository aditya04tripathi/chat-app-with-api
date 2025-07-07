import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { PoemsModule } from './poems/poems.module';
import { MessagesModule } from './messages/messages.module';

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
    MessagesModule,
  ],
  providers: [AppService, AuthService, PrismaService, JwtService],
})
export class AppModule {}
