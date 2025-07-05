import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/guards';
import { ConnectPartnerDto } from './dto/connect-partner.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('connect-partner')
  connectToPartner(
    @GetUser() user: User,
    @Body() connectPartnerDto: ConnectPartnerDto,
  ) {
    return this.userService.connectToPartner(user, connectPartnerDto);
  }
}
