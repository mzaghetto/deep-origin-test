import { ApiProperty } from '@nestjs/swagger';

export class ShortUrlResponseDto {
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
}
