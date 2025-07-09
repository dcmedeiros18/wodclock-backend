import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateWodDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: Date;
}
