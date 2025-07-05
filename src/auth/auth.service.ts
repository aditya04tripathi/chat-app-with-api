import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signin(dto: SignInDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        `The user with ${dto.email} was not found. Please sign up.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatches = await argon.verify(user.hashedPassword, password);
    if (!passwordMatches) {
      throw new HttpException(
        'The password entered seems to be invalid. Please try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.signToken(user.id, user.email);

    return {
      ok: true,
      message: token,
    };
  }

  async signup(dto: SignUpDto) {
    const hashedPassword = await argon.hash(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: hashedPassword,
        name: dto.name,
      },
    });

    return {
      ok: true,
      message:
        "A new user has been created successfully. Enjoy your time on Aayuu's gift website!",
    };
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET')!,
    });
  }

  async getMe(user: User) {
    const userId = user.id;

    const userData = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      throw new HttpException(
        'The user was not found. Please sign up.',
        HttpStatus.NOT_FOUND,
      );
    }

    // @ts-expect-error i know what I'm doing
    delete userData.hashedPassword;

    return {
      ok: true,
      message: userData,
    };
  }
}
