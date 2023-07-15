import {
  IsNotEmpty,
  ArrayMinSize,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PointModel } from '../models/point.model';
import { IPoint } from '../interfaces/point.interface';

export class UpdatePathDTO {
  @IsNumber({}, { message: 'ID must be not empty' })
  id: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  shortDescription?: string;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsOptional()
  @ValidateNested({ each: true, message: 'Points schema is invalid' })
  @Type(() => PointModel)
  @ArrayMinSize(2, { message: 'Points must have length more than 1' })
  points?: IPoint[];

  @IsOptional()
  @IsBoolean()
  inFavorites?: boolean;
}
