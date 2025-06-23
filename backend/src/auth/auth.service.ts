import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService
  ) {}
  async register(username: string, password: string) {
    const existingUser = await this.userService.getUserByUsername(username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(username, hashedPassword);
    return user;
  }
  async login(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const token = await this.generateToken(user.id);
    return { token };
  }
  async generateToken(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.sub;
    } catch {
      return null;
    }
  }
}
