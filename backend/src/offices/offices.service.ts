import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Office } from './office.model';
import { CreateOfficeDto } from './dto/create-office.dto';
import { CreateFloorDto } from './dto/create-floor.dto';
import { Floor } from './floor.model';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { Workplace } from './workplace.model';

@Injectable()
export class OfficesService {
  constructor(
    @InjectModel(Office) private readonly officeRepository: typeof Office,
    @InjectModel(Floor) private readonly floorRepository: typeof Floor,
    @InjectModel(Workplace) private readonly workplaceRepository: typeof Workplace
  ) {}
  
  async create(dto: CreateOfficeDto): Promise<Office> {
    const office = await this.officeRepository.create(dto);
    return office;
  }
  
  async createFloor(dto: CreateFloorDto): Promise<Floor> {
    const floor = await this.floorRepository.create(dto);
    return floor;
  }
  
  async createWorkplace(dto: CreateWorkplaceDto): Promise<Workplace> {
    const workplace = await this.workplaceRepository.create(dto);
    return workplace;
  }
  
  async getOfficesInclude(): Promise<Office[]> {
    return await this.officeRepository.findAll({
      include: [
        {
          model: Floor,
          attributes: ['id', 'level'],
          include: [
            {
              model: Workplace,
              attributes: ['id', 'title', 'x', 'y'],
            }
          ]
        }
      ]
    });
  }
  
  async getOffices(): Promise<Office[]> {
    return await this.officeRepository.findAll({ attributes: ['id', 'name', 'address'] });
  }
  
  async getFloors(id): Promise<Floor[]> {
    return await this.floorRepository.findAll({ where: { office_id: id }, attributes: ['id', 'level']});
  }
  
  async getWorkplaces(id): Promise<Workplace[]> {
    return await this.workplaceRepository.findAll({ where: { floor_id: id }, attributes: ['id', 'title', 'x', 'y']});
  }
}
