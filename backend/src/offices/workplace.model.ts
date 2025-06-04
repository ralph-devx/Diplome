import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Floor } from './floor.model';


interface WorkplaceCreationAttr {
  floor_id: number;
  title: string;
  x: number;
  y: number;
}

@Table({tableName: 'workplaces'})
export class Workplace extends Model<Workplace, WorkplaceCreationAttr> {
  @ApiProperty({example: 3, description: 'Этаж рабочего места'})
  @ForeignKey(() => Floor)
  @Column({type: DataType.INTEGER})
  declare floor_id: number;
  
  @BelongsTo(() => Floor, { foreignKey: 'floor_id'})
  floor: Floor;
  
  @ApiProperty({example: 'A1', description: 'Обозначение рабочего места'})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  declare title: string;
  
  @ApiProperty({example: 113, description: 'Расположение по горизонтали'})
  @Column({type: DataType.INTEGER, allowNull: false})
  declare x: number;
  
  @ApiProperty({example: 80, description: 'Расположение по вертикали'})
  @Column({type: DataType.INTEGER, allowNull: false})
  declare y: number;
}