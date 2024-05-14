import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  getJwtAccessTokenSecret(): string {
    return this.configService.get<string>('JWT_ACC_SECRET');
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
  getJwtRefreshTokenSecret(): string {
    return this.configService.get<string>('JWT_RESH_SECRET');
  }
  getEmailService(): string {
    return this.configService.get<string>('EMAIL_SERVICE');
  }

  getEmailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }
  getEmailUser(): string {
    return this.configService.get<string>('EMAIL_USER');
  }

  getEmailPass(): string {
    return this.configService.get<string>('EMAIL_PASS');
  }
}
