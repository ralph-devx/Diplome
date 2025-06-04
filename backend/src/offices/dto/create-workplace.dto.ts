import { ApiProperty } from '@nestjs/swagger';


export class CreateWorkplaceDto {
  @ApiProperty({example: 3, description: 'Этаж рабочего места'})
  readonly floor_id: number;
  @ApiProperty({example: 'A1', description: 'Обозначение рабочего места'})
  readonly title: string;
  @ApiProperty({example: 113, description: 'Расположение по горизонтали'})
  readonly x: number;
  @ApiProperty({example: 80, description: 'Расположение по вертикали'})
  readonly y: number;
  // ещё можно сделать изображение, но позже
}