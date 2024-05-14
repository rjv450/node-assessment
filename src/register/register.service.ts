/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserStatus } from '../enum/status';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationDto } from '../user/dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { VerifyOtpDto } from './dto/register.dto';
@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailerService,
  ) {}
  //register the user
  async createUser(createUserDto: RegistrationDto): Promise<User | any> {
    const { email, password } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
        OR: [
          { status: UserStatus.ACTIVE },
          { status: UserStatus.VERIFIED_PENDING },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException({
        message: `User with this email already exists`,
        statusCode: 102,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    let user = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        status: UserStatus.VERIFIED_PENDING,
        otp: otp.toString(),
        otpExpiry,
      },
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: 'sample',
      context: {
        email: email,
        otp: otp.toString(),
      },
    });
    return {
      message: 'Email verification required',
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
      },
    };
  }

  private generateOTP(): number {
    const buffer = crypto.randomBytes(4);
    const hexString = buffer.toString('hex');
    const otp = parseInt(hexString, 16) % 10000;
    return otp;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<string> {
    const { email, otp } = verifyOtpDto;
    const user = await this.prisma.user.findUnique({
      where: { email, status: UserStatus.VERIFIED_PENDING },
    });

    if (!user) {
      throw new NotFoundException({
        message: `User with Email ${email} not found`,
        statusCode: 101,
      });
    }

    if (user.otp !== otp) {
      throw new BadRequestException({
        message: 'Invalid OTP',
        statusCode: 103,
      });
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException({
        message: 'OTP has expired',
        statusCode: 104,
      });
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        status: UserStatus.ACTIVE,
      },
    });
    return 'OTP verified successfully';
  }
}
