import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      
      const authHeaders = req.headers.authorization;
      const bearer = authHeaders.split(' ')[0];
      const token = authHeaders.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
      }
      const user = this.jwtService.verify(token);
      req.user = user;
      return requiredRoles.includes(user.role);
    } catch (e) {
      throw new HttpException('Доступ запрещён', HttpStatus.FORBIDDEN);
    }
  }
}