import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Path } from './path.entity';
import { Repository } from 'typeorm';
import { CreatePathDTO } from './dto/create-path.dto';
import { UpdatePathDTO } from './dto/update-path.dto';

@Injectable()
export class PathService {
  constructor(
    @InjectRepository(Path) private readonly pathRepo: Repository<Path>,
  ) {}

  async getAll() {
    return this.pathRepo.find();
  }

  async getOne(id: number) {
    return this.pathRepo.findOneOrFail({ where: { id } });
  }

  async insertOne(path: CreatePathDTO) {
    const newPath = new Path(path);
    await this.pathRepo.save(newPath);
    return newPath;
  }

  async updateOne(path: UpdatePathDTO) {
    const { id, ...updatedColumns } = path;
    await this.pathRepo.update({ id }, updatedColumns);
    return this.getOne(id);
  }

  async deleteOne(id: number) {
    try {
      await this.pathRepo.delete({ id });
      return {
        deleted: true,
      };
    } catch (error) {
      return {
        deleted: false,
        message: error.message,
      };
    }
  }
}
