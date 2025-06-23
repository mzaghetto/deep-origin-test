import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';

import { ShortenUrlUseCase } from '../use-cases/shorten-url.use-case';
import { ListUrlsUseCase } from '../use-cases/list-urls.use-case';
import { RedirectUrlUseCase } from '../use-cases/redirect-url.use-case';
import { UpdateUrlUseCase } from '../use-cases/update-url.use-case';
import { CreateShortenDto } from '../dto/create-shorten.dto';
import { UpdateUrlDto } from '../dto/update-url.dto';
import { ShortUrlResponseDto } from '../dto/short-url-response.dto';
import { ListUrlsResponseDto } from '../dto/list-urls-response.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly listUrlsUseCase: ListUrlsUseCase,
    private readonly redirectUrlUseCase: RedirectUrlUseCase,
    private readonly updateUrlUseCase: UpdateUrlUseCase,
  ) {}

  @UseGuards(OptionalAuthGuard, ThrottlerGuard)
  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Shorten URL', 
    description: 'Creates a new shortened URL. Can be used without authentication (Bearer optional), but URLs created by authenticated users are linked to their account.' 
  })
  @ApiCreatedResponse({ 
    type: ShortUrlResponseDto,
    description: 'URL successfully shortened' 
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL or slug contains invalid characters'
  })
  @ApiConflictResponse({
    description: 'Custom slug is already in use'
  })
  async shorten(@Body(new ValidationPipe({ transform: true })) dto: CreateShortenDto, @Request() req: any) {
    const userId = req.user?.userId;
    return this.shortenUrlUseCase.execute(dto.url, dto.slug, userId);
  }

  @UseGuards(OptionalAuthGuard, ThrottlerGuard) 
  @Get('urls')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'List shortened URLs', 
    description: 'Lists shortened URLs. Requires authentication (Bearer token) to list user-specific URLs. Without auth, returns only anonymously created URLs.' 
  })
  @ApiOkResponse({ 
    type: [ListUrlsResponseDto],
    description: 'List of shortened URLs' 
  })
  async list(@Request() req: any) {
    const userId = req.user?.userId;
    return this.listUrlsUseCase.execute(userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to original URL', description: 'Redirects to the original URL corresponding to the provided slug. Does not require authentication.' })
  @ApiResponse({ 
    status: HttpStatus.FOUND,
    description: 'Redirect to original URL' 
  })
  @ApiNotFoundResponse({
    description: 'Slug not found'
  })
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const { url, isRedirect } = await this.redirectUrlUseCase.execute(slug);
    if (isRedirect) {
      return res.redirect(HttpStatus.TEMPORARY_REDIRECT, url);
    }
    return res.redirect(url);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':slug')
  @ApiOperation({ 
    summary: 'Update shortened URL', 
    description: 'Updates an existing URL. Requires authentication (Bearer token) and that the URL belongs to the user.' 
  })
  @ApiOkResponse({ 
    type: ShortUrlResponseDto,
    description: 'URL successfully updated' 
  })
  @ApiNotFoundResponse({
    description: 'Slug not found'
  })
  @ApiForbiddenResponse({
    description: 'URL does not belong to authenticated user'
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL or slug contains invalid characters'
  })
  @ApiConflictResponse({
    description: 'New slug is already in use'
  })
  async update(@Param('slug') slug: string, @Body(new ValidationPipe({ transform: true })) dto: UpdateUrlDto, @Request() req: any) {
    const userId = req.user.userId;
    return this.updateUrlUseCase.execute(slug, dto, userId);
  }
}
