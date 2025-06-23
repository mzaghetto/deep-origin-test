import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UpdateUrlUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(slug: string, dto: { url?: string; slug?: string }, userId: string) {
    const record = await this.prisma.url.findUnique({ where: { slug } });
    if (!record) {
      throw new NotFoundException('Not found');
    }
    if (record.userId !== userId) {
      throw new ForbiddenException('You dont have permission to update this URL');
    }

    if (dto.url) {
      const isValid = (() => {
        try {
          new URL(dto.url);
          return true;
        } catch {
          return false;
        }
      })();
      if (!isValid) {
        throw new BadRequestException('Invalid URL');
      }
    }

    try {
      const updatedRecord = await this.prisma.url.update({
        where: { slug },
        data: {
          url: dto.url,
          slug: dto.slug,
        },
      });
      const baseUrl = process.env.BASE_URL || '';
      return {
        slug: updatedRecord.slug,
        url: updatedRecord.url,
        shortUrl: `${baseUrl}/${updatedRecord.slug}`,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Slug already in use');
      }
      throw error;
    }
  }
}
