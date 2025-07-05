import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PoemsService } from './poems.service';
import { JwtGuard } from 'src/guards';
import { CreatePoemDto } from './dto/create-poem.dto';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';

@Controller('poems')
export class PoemsController {
  constructor(private readonly poems: PoemsService) {}

  @Get()
  getAllPoems() {
    return this.poems.getAllPoems();
  }

  @Get(':id')
  getPoemById(@Param('id') id: string) {
    return this.poems.getPoemById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  createPoem(@GetUser() user: User, @Body() createPoemDto: CreatePoemDto) {
    return this.poems.createPoem(createPoemDto, user);
  }

  @Delete(':id')
  deletePoem(@Param('id') id: string) {
    console.log(id);
    return this.poems.deletePoem(id);
  }
}
