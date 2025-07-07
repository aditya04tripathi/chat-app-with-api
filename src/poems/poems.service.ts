import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { User } from '@prisma/client';

@Injectable()
export class PoemsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPoems() {
    try {
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
        ok: true,
        message: poems,
      };
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPoemById(id: string) {
    try {
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

      if (!poem)
        throw new HttpException('Poem not found', HttpStatus.NOT_FOUND);

      return {
        ok: true,
        message: poem,
      };
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPoem(dto: CreatePoemDto, user: User) {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deletePoem(id: string) {
    try {
      await this.prisma.poem.delete({
        where: { id },
      });

      return {
        ok: true,
        message: 'Poem deleted successfully',
      };
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
