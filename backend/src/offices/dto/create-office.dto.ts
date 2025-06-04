import { ApiProperty } from '@nestjs/swagger';


export class CreateOfficeDto {
  @ApiProperty({example: 'ABC', description: 'Название офиса'})
  readonly name: string;
  
  @ApiProperty({example: 'Улица Пушкина, дом Колотушкина', description: 'Адрес'})
  readonly address: string;
}