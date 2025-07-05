import { Module } from '@nestjs/common';
import { PoemsController } from './poems.controller';
import { PoemsService } from './poems.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [PoemsController],
  providers: [PoemsService, JwtStrategy],
})
export class PoemsModule {}
