import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtGuard)
  @Get(':chatroomId')
  async getAllMessagesFromChatroom(
    @Param('chatroomId') chatroomId: string,
    @GetUser() user: User,
  ) {
    return await this.chatService.getAllMessagesFromChatroom(chatroomId, user);
  }
}
