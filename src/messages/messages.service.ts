import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteMessageById(messageId: string, user: User) {
    try {
      const message = await this.prismaService.message.findUnique({
        where: { id: messageId },
        include: { sender: true },
      });

      if (!message)
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      if (message.senderId !== user.id)
        throw new HttpException(
          'You are not authorized to delete this message',
          HttpStatus.FORBIDDEN,
        );

      await this.prismaService.message.delete({
        where: { id: messageId },
      });

      return {
        ok: true,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException(
        'Error deleting message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
