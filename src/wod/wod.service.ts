import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWodDto } from './dto/create-wod.dto';
import { UpdateWodDto } from './dto/update-wod.dto';
import { Wod } from './entities/wod.entity';

@Injectable()
export class WodService {
  constructor(
    @InjectRepository(Wod)
    private readonly wodRepository: Repository<Wod>,
  ) {}

  create(createWodDto: CreateWodDto) {
    return this.wodRepository.save(createWodDto);
  }

  findAll() {
    return this.wodRepository.find();
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
