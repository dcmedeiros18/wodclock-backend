import { IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsNumber()
  maxspots: number;

  @IsNumber()
  wod_id: number;
}
