import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConnectPartnerDto } from './dto/connect-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async connectToPartner(user: User, connectPartnerDto: ConnectPartnerDto) {
    try {
      const partner = await this.prismaService.user.findUnique({
        where: { email: connectPartnerDto.partnerEmail },
      });
      if (!partner)
        throw new HttpException('Partner not found', HttpStatus.NOT_FOUND);

      const chatroom = await this.prismaService.chatroom.create({
        data: {
          name: `✨ ${user.name} ✨ ${partner.name} ✨`,
          users: {
            connect: [{ id: user.id }, { id: partner.id }],
          },
        },
      });

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          chatroom: {
            connect: { id: chatroom.id },
          },
          onboarded: true,
        },
      });
      await this.prismaService.user.update({
        where: { id: partner.id },
        data: {
          chatroom: {
            connect: { id: chatroom.id },
          },
          onboarded: true,
        },
      });

      return {
        ok: true,
        message: 'Partner connected successfully',
      };
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
