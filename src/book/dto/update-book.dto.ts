import { IsOptional, IsNumber } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
