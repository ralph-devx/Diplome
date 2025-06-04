import { ApiProperty } from '@nestjs/swagger';


export class CreateBookingDto {
  @ApiProperty({example: 9, description: 'ID сотрудника'})
  readonly user_id: number;
  @ApiProperty({example: 5, description: 'ID рабочего места'})
  readonly workplace_id: number;
  @ApiProperty({example: '2025-06-04T06:02:48.280Z', description: 'Время начала брони'})
  readonly start_time: Date;
  @ApiProperty({example: '2025-06-04T06:02:48.280Z', description: 'Время окончания брони'})
  readonly end_time: Date;
  @ApiProperty({example: 'active', description: 'Статус брони'})
  readonly status: string;
}