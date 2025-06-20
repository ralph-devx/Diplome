import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { Booking } from './booking.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  
  @ApiOperation({summary: 'Создание брони'})
  @ApiResponse({status: 200, type: Booking})
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() bookingDto: CreateBookingDto) {
    return this.bookingService.create(bookingDto);
  }
  
  @ApiOperation({summary: 'Получение списка бронирований'})
  @ApiResponse({status: 200, type: Booking})
  @UseGuards(JwtAuthGuard)
  @Get()
  getBookings() {
    return this.bookingService.getBookings();
  }
  
  @ApiOperation({summary: 'Получение списка бронирований без вложений'})
  @ApiResponse({status: 200, type: Booking})
  @UseGuards(JwtAuthGuard)
  @Get('/notinclude')
  getOnlyBookings() {
    return this.bookingService.getOnlyBookings();
  }
  
  @ApiOperation({summary: 'Удаление брони по ID'})
  @ApiResponse({status: 200, type: Number})
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: Number
  })
  @Delete()
  deleteBooking(@Query('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
