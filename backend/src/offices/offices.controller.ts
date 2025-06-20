import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';

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
  
  @ApiOperation({ summary: 'Обновление данных офиса' })
  @ApiResponse({status: 200, type: Office})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/update')
  async updateOffice(@Body() officeDto: UpdateOfficeDto) {
    return await this.officesService.updateOffice(officeDto);
  }
  
  @ApiOperation({ summary: 'Получение всех офисов, включая этажи и рабочие места' })
  @ApiResponse({status: 200, type: Office})
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Office] // Указываем, что возвращается массив Office
  })
  @Get('/offices')
  getOffices() {
    return this.officesService.getOffices();
  }
  
  @ApiOperation({ summary: 'Удаление офиса по id' })
  @ApiResponse({status: 200, type: Number})
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: Number // Указываем, что возвращается массив Floor
  })
  @Delete('/offices')
  deleteOffices(@Query('id') id: number) {
    return this.officesService.deleteOffices(id);
  }
  
  
  @ApiOperation({ summary: 'Создание этажа офиса' })
  @ApiResponse({status: 200, type: Floor})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/floor')
  createFloor(@Body() floorDto: CreateFloorDto) {
    return this.officesService.createFloor(floorDto);
  }
  
  @ApiOperation({ summary: 'Получение этажей по id офиса' })
  @ApiResponse({status: 200, type: Floor})
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Floor] // Указываем, что возвращается массив Floor
  })
  @Get('/floors')
  getFloors(@Query('id') id: number)  {
    return this.officesService.getFloors(id);
  }
  
  @ApiOperation({ summary: 'Удаление этажа по id' })
  @ApiResponse({status: 200, type: Number})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: Number
  })
  @Delete('/floors')
  deleteFloors(@Query('id') id: number)  {
    return this.officesService.deleteFloors(id);
  }
  
  
  @ApiOperation({ summary: 'Создание рабочего места' })
  @ApiResponse({status: 200, type: Workplace})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/workplace')
  createWorkplace(@Body() workplaceDto: CreateWorkplaceDto) {
    return this.officesService.createWorkplace(workplaceDto);
  }
  
  @ApiOperation({ summary: 'Получение рабочих мест этажа по id' })
  @ApiResponse({status: 200, type: Workplace})
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: [Workplace] // Указываем, что возвращается массив Workplace
  })
  @Get('/workplace')
  getWorkplaces(@Query('id') id: number)  {
    return this.officesService.getWorkplaces(id);
  }
  
  @ApiOperation({ summary: 'Обновление данных рабочего места' })
  @ApiResponse({status: 200, type: Workplace})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/workplace/update')
  async updateWorkplaces(@Body() wpDto: UpdateWorkplaceDto[]) {
    return await this.officesService.updateWorkplace(wpDto);
  }
  
  @ApiOperation({ summary: 'Удаление рабочего места по id' })
  @ApiResponse({status: 200, type: Number})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete('/workplace')
  deleteWorkplace(@Query('id') id: number) {
    return this.officesService.deleteWorkplace(id);
  }
}
