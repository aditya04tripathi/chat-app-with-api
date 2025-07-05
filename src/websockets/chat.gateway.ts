import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket, Server } from 'socket.io';

class ChatMessage {
  @IsString()
  @IsNotEmpty()
  senderId: string;
  @IsString()
  @IsNotEmpty()
  chatroomId: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: ChatMessage) {
    const { senderId, chatroomId, content } = message;
    console.log({
      senderId,
      chatroomId,
      content,
    });

    try {
      const chatroom = await this.prisma.chatroom.findUnique({
        where: { id: chatroomId },
      });
      if (!chatroom) throw new Error('Chatroom not found');

      const user = await this.prisma.user.findUnique({
        where: { id: senderId },
      });
      if (!user) throw new Error('User not found');

      const newMessage = await this.prisma.message.create({
        data: {
          content,
          chatroom: { connect: { id: chatroomId } },
          sender: { connect: { id: senderId } },
        },
        include: {
          chatroom: true,
          sender: true,
        },
      });

      this.server.emit('message', {
        id: newMessage.id,
        content: newMessage.content,
        chatroom: newMessage.chatroom,
        chatroomId: newMessage.chatroomId,
        sender: newMessage.sender,
        senderId: newMessage.senderId,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        senderName: user.name,
      });
    } catch (error: any) {
      console.error('chat.gateway.ts:handleMessage()', error);
    }
  }
}
