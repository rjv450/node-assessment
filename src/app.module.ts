import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './register/register.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './config.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
    }),
    AuthModule,
    RegisterModule,
    PrismaModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACC_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('EMAIL_SERVICE'),
          host: configService.get<string>('EMAIL_HOST'),
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        template: {
          dir: join(__dirname, '..', 'src', 'mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    UserController,
    RegisterController,
    AuthController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    AuthService,
    RegisterService,
  ],
  exports: [PrismaService],
})
export class AppModule {}
