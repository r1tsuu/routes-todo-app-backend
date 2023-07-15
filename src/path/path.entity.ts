import { CreatePathDTO } from './dto/create-path.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPoint } from './interfaces/point.interface';

@Entity()
export class Path {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  description: string;

  @Column()
  distance: number;

  @Column({ type: 'jsonb' })
  points: IPoint[];

  @Column({ default: false })
  inFavorites: boolean;

  constructor(dto: CreatePathDTO) {
    Object.assign(this, dto);
    this.inFavorites = false;
  }
}
