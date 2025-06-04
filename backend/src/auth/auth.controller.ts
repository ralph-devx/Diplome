import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
// import { Users } from '../users/users.model';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiOperation({ summary: 'Авторизация' })
  // @ApiResponse({status: 200, type: AuthDto})
  @Post()
  login(@Body() userDto: CreateUserDto): Promise<AuthDto> {
    return this.authService.login(userDto);
  }
  
  @ApiOperation({ summary: 'Проверка jwt пользователя' })
  @Get('/check')
  checkJwt(@Req() req: Request) { // , @Res() res: Response
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      return null;
    }
    const token = authHeaders.split(' ')[1];
    console.log(token);
    const user = this.authService.validateAccessToken(token);
    if (!user) {
      throw new UnauthorizedException('Требуется авторизация');
    }
    return { token, user };
  }
}
