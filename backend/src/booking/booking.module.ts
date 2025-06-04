import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { OfficesModule } from '../offices/offices.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    AuthModule,
    OfficesModule,
    SequelizeModule.forFeature([Booking]),
  ],
  exports: [
    BookingService
  ]
})
export class BookingModule {}
