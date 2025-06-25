import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Office } from './office.model';
import { Workplace } from './workplace.model';
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';


interface FloorCreationAttr {
  office_id: number;
  level: number;
  image?: string | null; // Добавляем поле для изображения
}


@Table({tableName: 'floors'})
export class Floor extends Model<Floor, FloorCreationAttr> {
  @ApiProperty({example: 3, description: 'ID офиса'})
  @ForeignKey(() => Office)
  @Column({type: DataType.INTEGER})
  declare office_id: number;
  
  @BelongsTo(() => Office, { foreignKey: 'office_id'})
  declare office: Office;
  
  @ApiProperty({example: 3, description: 'Уровень этажа'})
  @Column({type: DataType.INTEGER})
  declare level: number;
  
  @ApiProperty({
    type: () => [Workplace],
    description: 'Рабочие места на этаже',
    example: [
      { id: 1, title: 'A1', x: 100, y: 200 },
      { id: 2, title: 'A2', x: 150, y: 200 }
    ]
  })
  @Type(() => Workplace)
  @HasMany(() => Workplace, { foreignKey: 'floor_id'})
  declare workplaces: Workplace[];
  
  // Добавляем поле для изображения
  @ApiProperty({ example: 'floor-plan.jpg', description: 'Изображение плана этажа' })
  @Column({type: DataType.STRING, allowNull: true})
  declare image: string | null;
}
