import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput, ChangePasswordInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, input: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data: input,
    });
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValid = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
