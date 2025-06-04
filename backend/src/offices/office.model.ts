import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Floor } from './floor.model';
import { Type } from 'class-transformer';


interface OfficeCreationAttr {
  name: string;
  address: string;
}


@Table({tableName: 'offices'})
export class Office extends Model<Office, OfficeCreationAttr> {
  @ApiProperty({example: 'ABC', description: 'Название офиса'})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  declare name: string;
  
  @ApiProperty({example: 'Улица Пушкина, дом Колотушкина', description: 'Адрес'})
  @Column({type: DataType.STRING, allowNull: false})
  declare address: string;
  
  
  @ApiProperty({
    type: () => [Floor],
    description: 'Этажи офиса',
    example: [
      {
        id: 1,
        level: 3,
        workplaces: [
          { id: 1, title: 'A1', x: 100, y: 200 },
          { id: 2, title: 'A2', x: 150, y: 200 }
        ]
      }
    ]
  })
  @Type(() => Floor)
  @HasMany(() => Floor, { foreignKey: 'office_id' })
  declare floors: Floor[];
}



// Офис (Office)
//
// id - уникальный идентификатор
//
// name - название офиса (например, "IQNIX Moscow HQ")
//
// address - полный адрес
//
// description - описание офиса (опционально)
//
// timezone - часовой пояс офиса
//
// created_at - дата создания записи
//
// Этаж (Floor)
//
// id - уникальный идентификатор
//
// office_id - связь с офисом (foreign key)
//
// level - номер этажа (1, 2, -1 и т.д.)
//
// map_image - путь к изображению плана этажа (опционально)
//
// description - описание этажа
//
// Рабочее место (Workplace)
//
// id - уникальный идентификатор
//
// floor_id - связь с этажом (foreign key)
//
// name - название/номер места (например, "A-12")
//
// type - тип места (обычное, переговорка, кабинет и т.д.)
//
// x_position - координата X на плане этажа
//
// y_position - координата Y на плане этажа
//
// equipment - оборудование (мониторы, докстанции и т.д.)
//
// status - текущий статус (active, maintenance, removed)
//
// Пользователь (User)
//
// id - уникальный идентификатор
//
// name - имя
//
// surname - фамилия
//
// email - электронная почта (логин)
//
// password_hash - хеш пароля
//
// role - роль (admin, manager, user)
//
// team_id - связь с командой (если есть разделение на команды)
//
// created_at - дата регистрации
//
// Бронирование (Booking)
//
// id - уникальный идентификатор
//
// user_id - кто забронировал (foreign key)
//
// workplace_id - какое место забронировано (foreign key)
//
// start_time - начало бронирования
//
// end_time - конец бронирования
//
// status - статус (active, cancelled, completed)
//
// created_at - дата создания брони
//
// Команда/Отдел (Team) (опционально)
//
// id - уникальный идентификатор
//
// name - название команды/отдела
//
// description - описание


// Модель Office
// @Table
// export class Office extends Model {
//   @PrimaryKey
//   @AutoIncrement
//   @Column
//   id: number;
//
//   @Column
//   name: string;
//
//   @Column
//   address: string;
//
//   @HasMany(() => Floor)
//   floors: Floor[];
// }
//
// // Модель Floor
// @Table
// export class Floor extends Model {
//   @PrimaryKey
//   @AutoIncrement
//   @Column
//   id: number;
//
//   @ForeignKey(() => Office)
//   @Column
//   office_id: number;
//
//   @BelongsTo(() => Office)
//   office: Office;
//
//   @Column
//   level: number;
//
//   @HasMany(() => Workplace)
//   workplaces: Workplace[];
// }
//
// // Модель Workplace
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
//   @BelongsTo(() => Floor)
//   floor: Floor;
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
//   @HasMany(() => Booking)
//   bookings: Booking[];
// }
//
// // Модель Booking
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
//   @BelongsTo(() => User)
//   user: User;
//
//   @ForeignKey(() => Workplace)
//   @Column
//   workplace_id: number;
//
//   @BelongsTo(() => Workplace)
//   workplace: Workplace;
//
//   @Column
//   start_time: Date;
//
//   @Column
//   end_time: Date;
//
//   @Column
//   status: 'active' | 'cancelled' | 'completed';
// }