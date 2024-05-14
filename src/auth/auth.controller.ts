// auth.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true })) loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.login(loginDto);
  }
  @Post('refresh-token')
  async refreshToken(
    @Body(new ValidationPipe({ transform: true }))
    refreshToken: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken };
  }
}
