import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateWodDto } from './dto/create-wod.dto';
import { UpdateWodDto } from './dto/update-wod.dto';
import { Wod } from './entities/wod.entity';
import { Raw } from 'typeorm';  

@Injectable()
export class WodService {
  constructor(
    @InjectRepository(Wod)
    private readonly wodRepository: Repository<Wod>,
  ) {}

  async create(createWodDto: CreateWodDto): Promise<Wod> {
    const wod = this.wodRepository.create(createWodDto);
    return this.wodRepository.save(wod);
  }

  async findByDate(date: string): Promise<Wod | null> {
    const wod = await this.wodRepository.findOne({
      where: { date: date }  
    });
  
    if (!wod) throw new NotFoundException('WOD not found');
    return wod;
  }
  
  

  async updateByDate(date: string, newDescription: string) {
    const wod = await this.wodRepository
      .createQueryBuilder('wod')
      .where('DATE(wod.date) = :date', { date })
      .getOne();
  
    if (!wod) throw new NotFoundException('WOD not found');
  
    wod.description = newDescription;
    return this.wodRepository.save(wod);
  }
  
  
  

  findOne(id: number) {
    return this.wodRepository.findOneBy({ id });
  }

  update(id: number, updateWodDto: UpdateWodDto) {
    return this.wodRepository.update(id, updateWodDto);
  }

  remove(id: number) {
    return this.wodRepository.delete(id);
  }
}
