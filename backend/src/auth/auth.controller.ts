import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register new user', description: 'Does not require authentication. Creates a new user account.' })
  @ApiResponse({ 
    status: 201,
    description: 'User successfully registered'
  })
  @ApiResponse({
    status: 409,
    description: 'Username already exists'
  })
  @ApiBody({
    description: 'Registration credentials',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'user123' },
        password: { type: 'string', example: 'securePassword123' }
      },
      required: ['username', 'password']
    }
  })
  async register(@Body() userData: { username: string; password: string }) {
    return this.authService.register(userData.username, userData.password);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login', description: 'Does not require authentication. Generates a Bearer token for authenticated requests.' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'user123' },
        password: { type: 'string', example: 'securePassword123' }
      },
      required: ['username', 'password']
    }
  })
  async login(@Body() credentials: { username: string; password: string }) {
    return this.authService.login(credentials.username, credentials.password);
  }
}
