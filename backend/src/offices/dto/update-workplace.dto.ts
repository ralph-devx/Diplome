import { ApiProperty } from '@nestjs/swagger';


export class UpdateWorkplaceDto {
  @ApiProperty({example: 1, description: 'ID рабочего места'})
  readonly id: number;
  @ApiProperty({example: 3, description: 'Этаж рабочего места'})
  readonly floor_id: number;
  @ApiProperty({example: 'A1', description: 'Обозначение рабочего места'})
  readonly title: string;
  @ApiProperty({example: 113, description: 'Расположение по горизонтали'})
  readonly x: number;
  @ApiProperty({example: 80, description: 'Расположение по вертикали'})
  readonly y: number;
  @ApiProperty({example: 20, description: 'Радиус рабочего места (точки на холсте)'})
  readonly radius: number;
  // ещё можно сделать изображение, но позже
}