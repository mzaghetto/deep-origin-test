import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Prisma } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let prismaMock: DeepMockProxy<PrismaService>;

  const mockUser: Prisma.UserGetPayload<{ include: { urls: true } }> = {
    id: 'user-id-123',
    username: 'testuser',
    password: 'hashedpass123',
    urls: [],
  };

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser()', () => {
    it('should successfully create a new user with valid data', async () => {
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser('testuser', 'validpassword');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          password: 'validpassword',
        },
      });
    });

    it('should propagate Prisma client errors during creation', async () => {
      prismaMock.user.create.mockRejectedValue(new Error('Database error'));

      await expect(
        userService.createUser('testuser', 'validpassword')
      ).rejects.toThrow('Database error');
    });
  });

  describe('getUser()', () => {
    it('should return a user when searching by valid ID', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUser('user-id-123');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-123' },
      });
    });

    it('should return null when user ID doesnt exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await userService.getUser('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('getUserByUsername()', () => {
    it('should return a user when username exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should handle case sensitivity in usernames correctly', async () => {
      const caseSensitiveMock = {
        ...mockUser,
        username: 'TestUser',
        urls: mockDeep<Prisma.PrismaPromise<Prisma.UrlGetPayload<{}>[]>>(),
      } as unknown as Prisma.UserGetPayload<{ include: { urls: true } }>;

      prismaMock.user.findUnique.mockResolvedValue(caseSensitiveMock);

      const upperCaseResult = await userService.getUserByUsername('TestUser');
      expect(upperCaseResult?.username).toBe('TestUser');

      prismaMock.user.findUnique.mockResolvedValue(null);

      const lowerCaseResult = await userService.getUserByUsername('testuser');
      expect(lowerCaseResult).toBeNull();
    });
  });
});