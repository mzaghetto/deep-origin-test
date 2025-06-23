import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/user/user.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');
jest.mock('../../src/user/user.service');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    jwtService = module.get<jest.Mocked<JwtService>>(JwtService);
  });

  describe('register', () => {
    it('should create a new user and return the user object when username is unique', async () => {
      const mockUser = { id: '1', username: 'test', password: 'hashed' };
      userService.getUserByUsername.mockResolvedValue(null);
      userService.createUser.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await authService.register('test', 'password');

      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userService.createUser).toHaveBeenCalledWith('test', 'hashed');
    });

    it('should throw ConflictException if username exists', async () => {
      const existingUser = { id: '1', username: 'existing', password: 'hashed' };
      userService.getUserByUsername.mockResolvedValue(existingUser);

      await expect(authService.register('existing', 'pass'))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a JWT token when username and password are valid', async () => {
      const mockUser = { id: '1', username: 'test', password: 'hashed' };
      userService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await authService.login('test', 'password');

      expect(result).toHaveProperty('token');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1' });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = { id: '1', username: 'test', password: 'hashed' };
      userService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login('test', 'wrong'))
        .rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
    });
  });

  describe('validateToken', () => {
    it('should return user ID for valid token', async () => {
      jwtService.verify.mockReturnValue({ sub: 'userId' });

      const result = await authService.validateToken('valid-token');

      expect(result).toBe('userId');
      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
    });

    it('should return null for invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.validateToken('invalid-token');

      expect(result).toBeNull();
      expect(jwtService.verify).toHaveBeenCalledWith('invalid-token');
    });
  });
});