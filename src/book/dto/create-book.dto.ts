import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsNumber()
  @Type(() => Number)
  classId: number;
}
