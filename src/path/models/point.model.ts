import { IsNumber } from 'class-validator';
import { IPoint } from '../interfaces/point.interface';

export class PointModel implements IPoint {
  @IsNumber({}, { message: 'Lat must be a number' })
  lat: number;

  @IsNumber({}, { message: 'Lng must be a number' })
  lng: number;
}
