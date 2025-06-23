import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RedirectUrlUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(slug: string) {
    const record = await this.prisma.url.findUnique({ where: { slug } });
    if (!record) {
      const frontendUrl = process.env.FRONTEND_URL_NOT_FOUND || '';
      return { url: frontendUrl, isRedirect: true };
    }
    await this.prisma.url.update({ where: { id: record.id }, data: { visits: { increment: 1 } } });
    return { url: record.url, isRedirect: false };
  }
}
