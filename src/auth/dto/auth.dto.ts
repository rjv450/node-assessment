// login.dto.ts
import { IsEmail, IsNotEmpty, isNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto{
    @IsNotEmpty()
    refresh_token : string ;
}