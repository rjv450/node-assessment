// auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decodedToken = this.jwtService.verify(token, {
          secret: 'JWTACCESSTOKEN',
        });
        req.user = decodedToken;
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Token not provided');
    }
  }
}
