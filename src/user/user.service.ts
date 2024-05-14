import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

import { UserStatus } from '../enum/status';
import { UpdateUserDto } from './dto/user.dto';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId), status: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException({
        message: `User with ID ${userId} not found`,
        statusCode: 101,
      });
    }
    return user;
  }
  // Get all users
  async getUserList(page: number, pageSize: number): Promise<User[]> {
    if (!page || !pageSize) {
      return await this.prisma.user.findMany({
        where: { status: UserStatus.ACTIVE },
      });
    }

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return users;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const errors = await validate(updateUserDto); // Validate the DTO

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    return updatedUser;
  }
}
