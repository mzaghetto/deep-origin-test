import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListUrlsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId?: string) {
    const where = userId ? { userId } : { userId: null };
    const list = await this.prisma.url.findMany({
      where,
    });
    const baseUrl = process.env.BASE_URL || '';
    return list.map((u) => ({
      slug: u.slug,
      url: u.url,
      shortUrl: `${baseUrl}/${u.slug}`,
      visits: u.visits,
      createdAt: u.createdAt,
    }));
  }
}
