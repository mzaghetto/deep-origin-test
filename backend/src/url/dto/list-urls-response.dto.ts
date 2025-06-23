import { ApiProperty } from '@nestjs/swagger';

export class ListUrlsResponseDto {
  @ApiProperty({
    description: 'Short URL slug',
    example: 'abc123'
  })
  slug!: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://example.com/long-url'
  })
  url!: string;

  @ApiProperty({
    description: 'Complete short URL',
    example: 'https://shortener.com/abc123'
  })
  shortUrl!: string;

  @ApiProperty({
    description: 'Visit count',
    example: 42
  })
  visits!: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt!: string;
}
