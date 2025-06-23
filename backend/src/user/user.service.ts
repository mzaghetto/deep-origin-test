import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, password: string) {
    return this.prisma.user.create({ data: { username, password } });
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
