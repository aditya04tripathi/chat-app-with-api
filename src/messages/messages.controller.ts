import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/guards';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtGuard)
  @Delete(':messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @GetUser() user: User,
  ) {
    return this.messagesService.deleteMessageById(messageId, user);
  }
}
