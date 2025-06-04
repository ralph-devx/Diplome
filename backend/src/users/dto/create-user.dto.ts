import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({example: 'ralph', description: 'Логин пользователя'})
  readonly login: string;
  @ApiProperty({example: 'Дмитрий', description: 'Имя пользователя'})
  readonly name: string;
  @ApiProperty({example: 'Царьков', description: 'Фамилия пользователя'})
  readonly surname: string;
  @ApiProperty({example: 'rHa3l@ph', description: 'Пароль пользователя'})
  readonly password: string;
  @ApiProperty({example: 'ADMIN', description: 'Роль пользователя'})
  readonly role?: string;
}