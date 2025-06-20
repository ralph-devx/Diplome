import { forwardRef, Module } from '@nestjs/common';
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
    SequelizeModule.forFeature([Booking]),
    forwardRef(() => OfficesModule),
  ],
  exports: [
    BookingService
  ]
})
export class BookingModule {}
