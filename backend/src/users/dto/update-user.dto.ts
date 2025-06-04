import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto {
  @ApiProperty({example: '1', description: 'id пользователя'})
  readonly id: number;
  @ApiProperty({example: 'ralph', description: 'Логин пользователя'})
  readonly login: string;
  @ApiProperty({example: 'Дмитрий', description: 'Имя пользователя'})
  readonly name: string;
  @ApiProperty({example: 'Царьков', description: 'Фамилия пользователя'})
  readonly surname: string;
  @ApiProperty({example: 'rHa3l@ph', description: 'Пароль пользователя'})
  password: string;
  @ApiProperty({example: 'ADMIN', description: 'Роль пользователя'})
  readonly role: string;
}