import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '../enum/status';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    return null;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWTACCESSTOKEN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('JWTREFRESTOKEN'),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<string> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(refreshTokenDto.refresh_token, {
        secret: this.configService.get<string>('JWTREFRESTOKEN'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.sub, status: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWTACCESSTOKEN'),
    });
    return accessToken;
  }
}
