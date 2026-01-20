import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { RegisterInput, LoginInput } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
    });
    return this.generateTokens(user);
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.generateTokens(stored.user);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return true;
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = uuid();
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    return { accessToken, refreshToken, user };
  }
}
