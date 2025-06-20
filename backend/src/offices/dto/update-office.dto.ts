import { ApiProperty } from '@nestjs/swagger';


export class UpdateOfficeDto {
  @ApiProperty({example: 1, description: 'ID офиса'})
  readonly id: number;
  
  @ApiProperty({example: 'ОФИС #1', description: 'Название офиса'})
  readonly name: string;
  
  @ApiProperty({example: 'Улица Пушкина, дом Колотушкина', description: 'Адрес'})
  readonly address: string;
}