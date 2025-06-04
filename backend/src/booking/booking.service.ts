import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { Model } from 'sequelize-typescript';
import { Floor } from '../offices/floor.model';
import { Workplace } from '../offices/workplace.model';
import { Office } from '../offices/office.model';
import { Op } from 'sequelize';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking) private readonly bookingRepository: typeof Booking,
    // @InjectModel(Workplace) private readonly workplaceRepository: typeof Workplace,
    // @InjectModel(Floor) private readonly floorRepository: typeof Floor,
    // @InjectModel(Office) private readonly officesRepository: typeof Office,
  ) {
  }
  
  async create(dto: CreateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.create(dto);
    return booking;
  }
  
  async getBookings(): Promise<Booking[]> {
    return await this.bookingRepository.findAll({
      attributes: ['id', 'start_time', 'end_time', 'status'],
      include: [
        {
          model: Workplace,
          attributes: ['id', 'title'],
          include: [
            {
              model: Floor,
              attributes: ['id', 'level'],
              include: [
                {
                  model: Office,
                  attributes: ['id', 'name'],
                }
              ]
            }
          ]
        }
      ]
    })
  }
  
  async getOnlyBookings(): Promise<Booking[]> {
    return await this.bookingRepository.findAll({
      attributes: ['id','workplace_id', 'start_time', 'end_time', 'status'],
    });
  }
  
  
  // async getBookingsByDate(date: Date): Promise<Booking[]> {
  //   return await this.bookingRepository.findAll({
  //     attributes: ['id', 'start_time', 'end_time', 'status'],
  //     where: {
  //       start_time: { [Op.gte]: date }
  //     },
  //     include: [
  //       {
  //         model: Workplace,
  //         attributes: ['id', 'level']
  //       }
  //     ]
  //   })
  // }
}
