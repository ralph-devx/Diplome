import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {};

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({status: 200, type: Users})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() userDto: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(userDto);
  }
  
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/delete')
  delete(@Query('id') id: number) {
    return this.usersService.deleteUser(id);
  }
  
  
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({status: 200, type: Users})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/update')
  async update(@Body() userDto: UpdateUserDto) {
    return await this.usersService.updateUser(userDto);
  }
  
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({status: 200, type: [Users]})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<Users[]> {
    return this.usersService.getAllUsers();
  }
  
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({status: 200, type: Users})
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  getUser(@Query('id') id: number): Promise<Users> {
    return this.usersService.getUserById(id);
  }
}
