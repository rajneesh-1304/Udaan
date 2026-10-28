import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const payload = this.jwtService.decode(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = payload;

    return true;
  }
}
