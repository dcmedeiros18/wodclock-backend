import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsDateString()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  classId: number;

}
