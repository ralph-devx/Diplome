import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Office } from './office.model';
import { CreateOfficeDto } from './dto/create-office.dto';
import { CreateFloorDto } from './dto/create-floor.dto';
import { Floor } from './floor.model';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { Workplace } from './workplace.model';
import { Booking } from '../booking/booking.model';
import { BookingService } from '../booking/booking.service';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectModel(Office) private readonly officeRepository: typeof Office,
    @InjectModel(Floor) private readonly floorRepository: typeof Floor,
    @InjectModel(Workplace) private readonly workplaceRepository: typeof Workplace,
    private readonly bookingService: BookingService,
    // @InjectModel(Booking) private readonly bookingRepository: typeof Booking
  ) {}
  
  async create(dto: CreateOfficeDto): Promise<Office> {
    const office = await this.officeRepository.create(dto);
    return office;
  }
  async getOfficesInclude(): Promise<Office[]> {
    return await this.officeRepository.findAll({
      attributes: ['id', 'name', 'address'],
      include: [
        {
          model: Floor,
          attributes: ['id', 'level'],
          include: [
            {
              model: Workplace,
              attributes: ['id', 'title', 'x', 'y', 'radius'],
            }
          ]
        }
      ]
    });
  }
  async getOffices(): Promise<Office[]> {
    return await this.officeRepository.findAll({ attributes: ['id', 'name', 'address'] });
  }
  async deleteOffices(id: number): Promise<number> {
    const floors = await this.floorRepository.findAll({ where: { office_id: id } })
    for (const floor of floors) {
      await this.deleteFloors(floor.id)
    }
    return await this.officeRepository.destroy({ where: { id }})
  }
  async updateOffice(dto: UpdateOfficeDto) {
    const office = await this.getOffice(dto.id);
    if (!office) {
      throw new BadRequestException({message: 'Офис не найден.'});
    }
    const data: UpdateOfficeDto = { ...dto };
    const [updateRows] = await this.officeRepository.update(data, { where: { id: dto.id } });
    if (updateRows > 0) {
      return await this.officeRepository.findOne({ where: { id: dto.id } });
    } else {
      return {status: 404};
    }
  }
  async getOffice(id: number): Promise<Office | null> {
    const office = await this.officeRepository.findOne({ where: { id }})
    if (!office) {
      return null;
    }
    return office;
  }
  
  async createFloor(dto: CreateFloorDto): Promise<Floor> {
    const floor = await this.floorRepository.create(dto);
    return floor;
  }
  async getFloors(id: number): Promise<Floor[]> {
    return await this.floorRepository.findAll({ where: { office_id: id }, attributes: ['id', 'level']});
  }
  async deleteFloors(id: number): Promise<number> {
    const workplaces = await this.workplaceRepository.findAll({ where: { floor_id: id } });
    for (const workplace of workplaces) {
      await this.bookingService.deleteBooking(workplace.id);
    }
    await this.workplaceRepository.destroy({ where: { floor_id: id } });
    return await this.floorRepository.destroy({ where: { id: id } });
  }
  
  
  async createWorkplace(dto: CreateWorkplaceDto): Promise<Workplace> {
    const workplace = await this.workplaceRepository.create(dto);
    return workplace;
  }
  async getWorkplaces(id: number): Promise<Workplace[]> {
    return await this.workplaceRepository.findAll({ where: { floor_id: id }, attributes: ['id', 'title', 'x', 'y', 'radius']});
  }
  async updateWorkplace(dto: UpdateWorkplaceDto[]) {
    let floorId = 0;
    for (const wp of dto) {
      const workplace = await this.workplaceRepository.findOne({ where: { id: wp.id } });
      if (!workplace) {
        console.log(`[${wp.id}] Рабочее место не найдено.`);
        continue;
      }
      floorId = workplace.floor_id;
      const data: UpdateWorkplaceDto = { ...wp };
      const [updateRows] = await this.workplaceRepository.update(data, { where: { id: data.id } });
      if (updateRows > 0) {
        await this.workplaceRepository.findOne({ where: { id:  data.id } });
      }
    }
    return await this.workplaceRepository.findAll({ where: { floor_id: floorId }, attributes: ['id', 'title', 'x', 'y', 'radius']});
  }
  
  async deleteWorkplace(id: number) {
    const workplace = await this.workplaceRepository.findOne({ where: { id } });
    if (!workplace) {
      throw new BadRequestException({message: 'Рабочее место не найдено.'})
    }
    await this.bookingService.deleteBooking(workplace.id);
    return await this.workplaceRepository.destroy({ where: { id }});
  }
}
