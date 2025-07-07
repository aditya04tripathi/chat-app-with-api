import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMessagesFromChatroom(chatroomId: string, user: User) {
    try {
      const chatroom = await this.prisma.chatroom.findUnique({
        where: { id: chatroomId },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!chatroom)
        throw new HttpException('Chatroom not found', HttpStatus.NOT_FOUND);
      if (!chatroom.users.some((u) => u.id === user.id))
        throw new HttpException(
          'User not part of chatroom',
          HttpStatus.FORBIDDEN,
        );

      console.log(JSON.stringify(chatroom, null, 2));
      return {
        ok: true,
        message: chatroom,
      };
    } catch (error: any) {
      console.error('chat.service.ts:getAllMessagesFromChatroom()', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
