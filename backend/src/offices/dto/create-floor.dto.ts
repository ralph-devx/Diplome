import { ApiProperty } from '@nestjs/swagger';


export class CreateFloorDto {
  @ApiProperty({example: 3, description: 'ID офиса'})
  readonly office_id: number;
  
  @ApiProperty({example: 1, description: 'Номер этажа'})
  readonly level: number;
  
  @ApiProperty({example: 'floor-plan.jpg', description: 'Изображение плана этажа'})
  readonly image: string;
}