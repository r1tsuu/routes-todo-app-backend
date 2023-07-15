import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { PointModel } from '../models/point.model';
import { IPoint } from '../interfaces/point.interface';

export class CreatePathDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsNumber()
  distance: number;

  @ValidateNested({ each: true, message: 'Points schema is invalid' })
  @Type(() => PointModel)
  @ArrayMinSize(2, { message: 'Points must have length more than 1' })
  points: IPoint[];
}
