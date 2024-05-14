import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';

import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService],
  exports: [RegisterService],
})
export class RegisterModule {}
