import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { User } from '@prisma/client';

@Injectable()
export class PoemsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPoems() {
    const poems = await this.prisma.poem.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      message: poems,
    };
  }

  async getPoemById(id: string) {
    const poem = await this.prisma.poem.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!poem) throw new HttpException('Poem not found', HttpStatus.NOT_FOUND);

    return {
      message: poem,
    };
  }

  async createPoem(dto: CreatePoemDto, user: User) {
    const poem = await this.prisma.poem.create({
      data: {
        title: dto.title,
        content: dto.content,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: poem ? 'Poem created successfully' : 'Failed to create poem',
    };
  }

  async deletePoem(id: string) {
    await this.prisma.poem.delete({
      where: { id },
    });

    return {
      ok: true,
      message: 'Poem deleted successfully',
    };
  }
}
