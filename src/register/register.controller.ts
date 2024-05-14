import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegistrationDto } from '../user/dto/user.dto';
import { RegisterService } from './register.service';
import { VerifyOtpDto } from './dto/register.dto';

@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService) {}
  @Post('registration')
  async createuser(
    @Body(new ValidationPipe({ transform: true }))
    registrationData: RegistrationDto,
  ): Promise<User | null> {
    return this.registerService.createUser(registrationData);
  }
  @Post('verify')
  async verifyOtp(
    @Body(new ValidationPipe({ transform: true })) verifyOtpDto: VerifyOtpDto,
  ): Promise<string> {
    return await this.registerService.verifyOtp(verifyOtpDto);
  }
}
