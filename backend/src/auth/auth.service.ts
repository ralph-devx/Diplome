import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/users.model';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(dto: CreateUserDto): Promise<AuthDto> {
    const user = await this.validateUser(dto);
    // return this.generateToken(user);
    return {user: user, ...await this.generateToken(user)};
  }
  
  private async generateToken(user: Users): Promise<{token: string}> {
    const payload = {
      id: user.id,
      login: user.login,
      name: user.name,
      surname: user.surname,
      password: user.password,
      role: user.role
    };
    return { token: this.jwtService.sign(payload) };
  }
  
  private async validateUser(userDto: CreateUserDto): Promise<Users> {
    const user = await this.usersService.getUserByLogin(userDto.login);
    if (user) {
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (passwordEquals) { return user; }
    }
    throw new UnauthorizedException({message: 'Некорректный логин или пароль.'});
  }
  
  validateAccessToken(token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      const userData = this.jwtService.verify(token); // {secret: process.env.JWT_PRIVATE_KEY}
      console.log(token);
      console.log(userData);
      return userData;
    } catch (e) {
      return null;
    }
  }
}
