import { forwardRef, Module } from '@nestjs/common';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Office } from './office.model';
import { Floor } from './floor.model';
import { Workplace } from './workplace.model';
import { AuthModule } from '../auth/auth.module';
import { BookingModule } from '../booking/booking.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [OfficesController],
  providers: [OfficesService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([Office, Floor, Workplace]),
    forwardRef(() => BookingModule),
    FilesModule
  ],
  exports: [
    OfficesService,
  ]
})
export class OfficesModule {}
