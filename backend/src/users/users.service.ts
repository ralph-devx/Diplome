import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private userRepository: typeof Users) {}
  
  async createUser(dto: CreateUserDto) {
    const data: CreateUserDto = {...dto, password: await bcrypt.hash(dto.password, 5) };
    const user = await this.userRepository.create(data);
    return user;
  }
  
  compareBcryptHashes(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) return false;
    
    const params1 = this.extractHashParams(hash1);
    const params2 = this.extractHashParams(hash2);
    
    if (!params1 || !params2) return false; // невалидные хэши
    if (
      params1.version !== params2.version ||
      params1.cost !== params2.cost ||
      params1.salt !== params2.salt
    ) {
      return false;
    }
    
    // Сравниваем бинарные данные хэшей
    return params1.hash === params2.hash;
  }
  
  extractHashParams(hash: string) {
    const match = hash.match(/^\$([a-z0-9]+)\$(\d+)\$([a-zA-Z0-9./]{53})$/i);
    if (!match) return null;
    
    const full = match[0];
    const version = match[1];
    const cost = parseInt(match[2]);
    const salt = match[3].substring(0, 22);
    const hashPart = match[3].substring(22);
    
    return { full, version, cost, salt, hash: hashPart };
  }
  
  async updateUser(dto: UpdateUserDto) {
    const user = await this.getUserByLogin(dto.login);
    if (!user) {
      throw new UnauthorizedException({message: 'Некорректный логин или пароль.'});
    }
    const data: UpdateUserDto = { ...dto };
    const passwordEquals = this.compareBcryptHashes(dto.password, user.password);
    if (!passwordEquals) {
      data.password = await bcrypt.hash(dto.password, 5);
    }
    const [updateRows] = await this.userRepository.update(data, { where: { id: dto.id } });
    if (updateRows > 0) {
      return await this.userRepository.findOne({ where: { id: dto.id } });
    } else {
      return {status: 404};
    }
  }
  
  async deleteUser(id: number) {
    return await this.userRepository.destroy({ where: { id: id } });
  }
  
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
  
  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({ where: { login } });
    return user;
  }
  
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException({message: 'Некорректный логин или пароль.'});
    }
    return user;
  }
}
