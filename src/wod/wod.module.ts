import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WodService } from './wod.service';
import { WodController } from './wod.controller';
import { Wod } from './entities/wod.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wod])],
  controllers: [WodController],
  providers: [WodService],
})
export class WodModule {}
