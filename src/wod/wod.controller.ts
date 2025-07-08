import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WodService } from './wod.service';
import { CreateWodDto } from './dto/create-wod.dto';
import { UpdateWodDto } from './dto/update-wod.dto';

@Controller('wod')
export class WodController {
  constructor(private readonly wodService: WodService) {}

  @Post()
  create(@Body() createWodDto: CreateWodDto) {
    return this.wodService.create(createWodDto);
  }

  @Get()
  findAll() {
    return this.wodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWodDto: UpdateWodDto) {
    return this.wodService.update(+id, updateWodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wodService.remove(+id);
  }
}
