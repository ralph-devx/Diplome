import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';


interface UserCreationAttr {
  login: string;
  password: string;
  name: string;
  surname: string;
  role?: string;
}

@Table({tableName: 'users'})
export class Users extends Model<Users, UserCreationAttr> {
  // @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  // id: number;
  
  @ApiProperty({example: 'ralph', description: 'Логин пользователя'})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  declare login: string;
  
  @ApiProperty({example: 'Дмитрий', description: 'Имя пользователя'})
  @Column({type: DataType.STRING})
  declare name: string;
  
  @ApiProperty({example: 'Царьков', description: 'Фамилия пользователя'})
  @Column({type: DataType.STRING})
  declare surname: string;
  
  @ApiProperty({example: 'rHa3l@ph', description: 'Пароль пользователя'})
  @Column({type: DataType.STRING, allowNull: false})
  declare password: string;
  
  @ApiProperty({example: 'ADMIN', description: 'Роль пользователя'})
  @Column({type: DataType.STRING, defaultValue: 'USER'})
  declare role: string;
}