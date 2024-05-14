import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../filters/jwt.middleware';
import { AuthMiddleware } from '../filters/middleware.filter';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/user');
  }
}
