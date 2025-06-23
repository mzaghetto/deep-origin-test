import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { ShortenUrlUseCase } from './use-cases/shorten-url.use-case';
import { ListUrlsUseCase } from './use-cases/list-urls.use-case';
import { RedirectUrlUseCase } from './use-cases/redirect-url.use-case';
import { UpdateUrlUseCase } from './use-cases/update-url.use-case';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [UrlController],
  providers: [ShortenUrlUseCase, ListUrlsUseCase, RedirectUrlUseCase, UpdateUrlUseCase],
})
export class UrlModule {}
