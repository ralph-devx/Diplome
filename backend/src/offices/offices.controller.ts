import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOfficeDto } from './dto/create-office.dto';
import { Office } from './office.model';
import { Floor } from './floor.model';
import { CreateFloorDto } from './dto/create-floor.dto';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { Workplace } from './workplace.model';

@ApiTags('Offices')
@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @ApiOperation({ summary: 'Создание офиса' })
  @ApiResponse({status: 200, type: Office})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  createOffice(@Body() officeDto: CreateOfficeDto) {
    return this.officesService.create(officeDto);
  }
  
  @ApiOperation({ summary: 'Создание этажа офиса' })
  @ApiResponse({status: 200, type: Floor})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/floor')
  createFloor(@Body() floorDto: CreateFloorDto) {
    return this.officesService.createFloor(floorDto);
  }
  
  @ApiOperation({ summary: 'Создание рабочего места' })
  @ApiResponse({status: 200, type: Workplace})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/workplace')
  createWorkplace(@Body() workplaceDto: CreateWorkplaceDto) {
    return this.officesService.createWorkplace(workplaceDto);
  }
  
  @ApiOperation({ summary: 'Получение всех офисов, включая этажи и рабочие места' })
  @ApiResponse({status: 200, type: Office})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Office] // Указываем, что возвращается массив Office
  })
  @Get()
  getOfficesInclude() {
    return this.officesService.getOfficesInclude();
  }
  
  @ApiOperation({ summary: 'Получение всех офисов' })
  @ApiResponse({status: 200, type: Office})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Office] // Указываем, что возвращается массив Office
  })
  @Get('/offices')
  getOffices() {
    return this.officesService.getOffices();
  }
  
  @ApiOperation({ summary: 'Получение этажей по id офиса' })
  @ApiResponse({status: 200, type: Floor})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Floor] // Указываем, что возвращается массив Floor
  })
  @Get('/floors')
  getFloors(@Query('id') id: number)  {
    return this.officesService.getFloors(id);
  }
  
  @ApiOperation({ summary: 'Получение рабочих мест этажа по id' })
  @ApiResponse({status: 200, type: Workplace})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Workplace] // Указываем, что возвращается массив Workplace
  })
  @Get('/workplace')
  getWorkplaces(@Query('id') id: number)  {
    return this.officesService.getWorkplaces(id);
  }
}
