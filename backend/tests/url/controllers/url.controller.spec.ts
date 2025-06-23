import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../../src/url/controllers/url.controller';
import { ShortenUrlUseCase } from '../../../src/url/use-cases/shorten-url.use-case';
import { ListUrlsUseCase } from '../../../src/url/use-cases/list-urls.use-case';
import { RedirectUrlUseCase } from '../../../src/url/use-cases/redirect-url.use-case';
import { UpdateUrlUseCase } from '../../../src/url/use-cases/update-url.use-case';
import { mockDeep } from 'jest-mock-extended';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';

// Mocks reutilizáveis
const createMockShortenedUrl = (slug: string, url: string) => ({
  slug,
  url,
  shortUrl: `http://short/${slug}`,
});

const createMockUrlList = () => [
  {
    slug: 'abc123',
    url: 'https://example.com',
    visits: 10,
    shortUrl: 'http://short/abc123',
    createdAt: new Date(),
  },
];

describe('UrlController', () => {
  let controller: UrlController;
  let shortenUrlUseCase: jest.Mocked<ShortenUrlUseCase>;
  let listUrlsUseCase: jest.Mocked<ListUrlsUseCase>;
  let redirectUrlUseCase: jest.Mocked<RedirectUrlUseCase>;
  let updateUrlUseCase: jest.Mocked<UpdateUrlUseCase>;
  const mockResponse = {
    redirect: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: ShortenUrlUseCase,
          useValue: mockDeep<ShortenUrlUseCase>(),
        },
        {
          provide: ListUrlsUseCase,
          useValue: mockDeep<ListUrlsUseCase>(),
        },
        {
          provide: RedirectUrlUseCase,
          useValue: mockDeep<RedirectUrlUseCase>(),
        },
        {
          provide: UpdateUrlUseCase,
          useValue: mockDeep<UpdateUrlUseCase>(),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UrlController>(UrlController);
    shortenUrlUseCase = module.get(ShortenUrlUseCase);
    listUrlsUseCase = module.get(ListUrlsUseCase);
    redirectUrlUseCase = module.get(RedirectUrlUseCase);
    updateUrlUseCase = module.get(UpdateUrlUseCase);
  });

  describe('shorten()', () => {
    it('should return shortened URL when valid data is provided', async () => {
      const mockResult = createMockShortenedUrl('abc123', 'https://example.com');
      shortenUrlUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.shorten(
        { url: 'https://example.com' },
        { user: { userId: 'user123' } }
      );

      expect(result).toEqual(mockResult);
      expect(shortenUrlUseCase.execute).toHaveBeenCalledWith(
        'https://example.com',
        undefined,
        'user123'
      );
    });

    it('should allow optional authentication', async () => {
      const mockResult = createMockShortenedUrl('def456', 'https://test.com');
      shortenUrlUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.shorten(
        { url: 'https://test.com' },
        { user: undefined }
      );

      expect(result).toEqual(mockResult);
      expect(shortenUrlUseCase.execute).toHaveBeenCalledWith(
        'https://test.com',
        undefined,
        undefined
      );
    });

    it('should throw an error when URL is invalid', async () => {
      shortenUrlUseCase.execute.mockRejectedValue(new Error('Invalid URL'));

      await expect(
        controller.shorten({ url: 'invalid-url' }, { user: { userId: 'user123' } })
      ).rejects.toThrow('Invalid URL');
    });
  });

  describe('list()', () => {
    it('should return URLs for authenticated user', async () => {
      const mockUrls = createMockUrlList();
      listUrlsUseCase.execute.mockResolvedValue(mockUrls);

      const result = await controller.list({ user: { userId: 'user123' } });

      expect(result).toEqual(mockUrls);
      expect(listUrlsUseCase.execute).toHaveBeenCalledWith('user123');
    });

    it('should return public URLs for unauthenticated users', async () => {
      const mockUrls = createMockUrlList();
      listUrlsUseCase.execute.mockResolvedValue(mockUrls);

      const result = await controller.list({ user: undefined });

      expect(result).toEqual(mockUrls);
      expect(listUrlsUseCase.execute).toHaveBeenCalledWith(undefined);
    });
  });

  describe('redirect()', () => {
    it('should redirect to original URL when slug exists', async () => {
      redirectUrlUseCase.execute.mockResolvedValue({
        url: 'https://example.com',
        isRedirect: false,
      });
      await controller.redirect('validslug', mockResponse);
      expect(mockResponse.redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should redirect to custom 404 page when slug doesnt exist', async () => {
      redirectUrlUseCase.execute.mockResolvedValue({
        url: 'http://frontend/404',
        isRedirect: true,
      });
      await controller.redirect('invalidslug', mockResponse);
      expect(mockResponse.redirect).toHaveBeenCalledWith(307, 'http://frontend/404');
    });
  });

  describe('update()', () => {
    it('should update URL when user is owner', async () => {
      const mockUpdated = createMockShortenedUrl('abc123', 'https://updated.com');
      updateUrlUseCase.execute.mockResolvedValue(mockUpdated);

      const result = await controller.update(
        'abc123',
        { url: 'https://updated.com' },
        { user: { userId: 'owner123' } }
      );

      expect(result).toEqual(mockUpdated);
      expect(updateUrlUseCase.execute).toHaveBeenCalledWith(
        'abc123',
        { url: 'https://updated.com' },
        'owner123'
      );
    });

    it('should throw when user is not owner', () => {
      updateUrlUseCase.execute.mockRejectedValue(new Error('Forbidden'));

      return expect(
        controller.update(
          'abc123',
          { url: 'https://updated.com' },
          { user: { userId: 'not-owner' } }
        )
      ).rejects.toThrow('Forbidden');
    });
  });
});