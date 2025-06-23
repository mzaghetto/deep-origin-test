import { IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({ description: 'URL to be updated' })
  @IsUrl({}, { message: 'Invalid URL' })
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Custom slug (optional)' })
  @IsOptional()
  slug?: string;
}
