import { IsUrl, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenDto {
  @ApiProperty({ description: 'URL to be shortened (must start with http:// or https://)' })
  @IsUrl({}, { message: 'Invalid URL - must start with http:// or https://' })
  url!: string;

  @ApiProperty({ description: 'Custom slug (optional)' })
  @IsOptional()
  @Matches(/^[\w-]+$/, { message: 'Invalid custom slug' })
  slug?: string;
}
