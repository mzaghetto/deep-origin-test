import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShortenUrlUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(url: string, slug?: string, userId?: string) {
    const { nanoid } = await (eval('import("nanoid/non-secure")') as Promise<{ nanoid(size?: number): string }>);

    // Regex to check if a string starts with 'http://' or 'https://'
    // and contains no spaces or invalid characters right after.
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    const isValid = urlPattern.test(url);

    if (!isValid) {
      throw new BadRequestException('URL must start with http:// or https:// and contain a valid domain');
    }
    
    const newSlug = slug || nanoid(8);

    // Check if 'slug' contains only letters, numbers, underscores or hyphens.
    if (slug && !/^[\w-]+$/.test(slug)) {
      throw new BadRequestException('Invalid custom slug');
    }

    const exists = await this.prisma.url.findUnique({ where: { slug: newSlug } });

    if (exists) {
      throw new ConflictException('Slug already in use');
    }

    const record = await this.prisma.url.create({ data: { slug: newSlug, url, user: userId ? { connect: { id: userId } } : undefined } });
    const baseUrl = process.env.BASE_URL || '';

    return {
      slug: record.slug,
      url: record.url,
      shortUrl: `${baseUrl}/${record.slug}`,
    };
  }
}
