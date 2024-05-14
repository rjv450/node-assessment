import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../filters/jwt.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('userId') userId: number) {
    console.log('djdj');

    return this.userService.getUser(userId);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.userService.getUserList(page, pageSize);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
