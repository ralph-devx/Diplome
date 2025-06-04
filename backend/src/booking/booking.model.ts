import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Workplace } from '../offices/workplace.model';
import { Users } from '../users/users.model';
import { ApiProperty } from '@nestjs/swagger';


interface BookingCreateAttr {
  user_id: number;
  workplace_id: number;
  start_time: Date;
  end_time: Date;
  status: string;
}


@Table({tableName: 'booking'})
export class Booking extends Model<Booking, BookingCreateAttr> {
  @ApiProperty({example: 1, description: 'ID сотрудника'})
  @ForeignKey(() => Users)
  @Column({type: DataType.INTEGER, allowNull: false})
  declare user_id: number;
  
  @ApiProperty({example: 3, description: 'ID рабочие места'})
  @ForeignKey(() => Workplace)
  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  declare workplace_id: number;
  
  @ApiProperty({example: '2023-10-05T14:00:00Z', description: 'Дата начала брони'})
  @Column({type: DataType.DATE, allowNull: false})
  declare start_time: Date;
  
  @ApiProperty({example: '2023-10-05T14:00:00Z', description: 'Дата окончания брони'})
  @Column({type: DataType.DATE, allowNull: false})
  declare end_time: Date;
  
  @ApiProperty({example: 'reserved', description: 'Статус брони'})
  @Column({
    type: DataType.ENUM('reserved', 'cancelled', 'completed', 'occupied'),
    defaultValue: 'reserved'
  })
  declare status: string;
  
  @BelongsTo(() => Users)
  declare user: Users;
  
  @BelongsTo(() => Workplace)
  declare workplace: Workplace;
}






// // Модель Workplace (Рабочее место)
// @Table
// export class Workplace extends Model {
//   @PrimaryKey
//   @AutoIncrement
//   @Column
//   id: number;
//
//   @ForeignKey(() => Floor)
//   @Column
//   floor_id: number;
//
//   @Column
//   name: string;
//
//   @Column
//   x_position: number;
//
//   @Column
//   y_position: number;
//
//   // Физическое состояние (не влияет на бронирование)
//   @Column({
//     type: DataType.ENUM('active', 'maintenance', 'removed'),
//     defaultValue: 'active'
//   })
//   physical_status: string;
//
//   // Не храним статус занятости здесь!
// }
//
// // Модель Booking (Бронирование)
// @Table
// export class Booking extends Model {
//   @PrimaryKey
//   @AutoIncrement
//   @Column
//   id: number;
//
//   @ForeignKey(() => User)
//   @Column
//   user_id: number;
//
//   @ForeignKey(() => Workplace)
//   @Column
//   workplace_id: number;
//
//   @Column
//   start_time: Date;
//
//   @Column
//   end_time: Date;
//
//   @Column({
//     type: DataType.ENUM('active', 'cancelled', 'completed'),
//     defaultValue: 'active'
//   })
//   status: string;
// }