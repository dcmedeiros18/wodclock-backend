import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WodService } from './wod.service';
import { CreateWodDto } from './dto/create-wod.dto';
import { UpdateWodDto } from './dto/update-wod.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('api/wods')
export class WodController {
  constructor(private readonly wodService: WodService) {}

  @Post()
  create(@Body() wodDto: CreateWodDto) {
    return this.wodService.create(wodDto);
  }

  @Get()
  findByDate(@Query('date') date: string) {
    return this.wodService.findByDate(date);
  }

  @Get('')
  findOne(@Query('date') date: string) {
    return this.wodService.findByDate(date);
  }

  @Patch(':id')
  @Roles('admin', 'coach') 
  update(@Param('id') id: string, @Body() updateWodDto: UpdateWodDto) {
    return this.wodService.update(+id, updateWodDto);
  }

  @Delete('')
  @Roles('admin', 'coach') 
  deleteByDate(@Query('date') date: string) {
    return this.wodService.deleteByDate(date);
  }

  @Put(':date')
  @Roles('admin', 'coach')
  updateByDate(@Param('date') date: string, @Body() data: Partial<CreateWodDto>) {
    return this.wodService.updateByDate(date, data);
  }

}
