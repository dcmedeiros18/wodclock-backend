import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateWodDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}
