import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { Booking } from './booking.model';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  
  @ApiOperation({summary: 'Создание брони'})
  @ApiResponse({status: 200, type: Booking})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() bookingDto: CreateBookingDto) {
    return this.bookingService.create(bookingDto);
  }
  
  @ApiOperation({summary: 'Получение списка бронирований'})
  @ApiResponse({status: 200, type: Booking})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getBookings() {
    return this.bookingService.getBookings();
  }
  
  @ApiOperation({summary: 'Получение списка бронирований без вложений'})
  @ApiResponse({status: 200, type: Booking})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get('/notinclude')
  getOnlyBookings() {
    return this.bookingService.getOnlyBookings();
  }
}
