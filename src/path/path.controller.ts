import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PathService } from './path.service';
import { CreatePathDTO } from './dto/create-path.dto';
import { UpdatePathDTO } from './dto/update-path.dto';

@Controller('path')
export class PathController {
  constructor(private readonly pathService: PathService) {}

  @Get()
  async getPaths() {
    return this.pathService.getAll();
  }

  @Get('/id/:id')
  async getOnePath(@Param('id') id: number) {
    return this.pathService.getOne(id);
  }

  @Post('/new')
  async newPath(@Body() dto: CreatePathDTO) {
    return this.pathService.insertOne(dto);
  }

  @Put('/update')
  async updatePath(@Body() dto: UpdatePathDTO) {
    return this.pathService.updateOne(dto);
  }

  @Delete('/delete/:id')
  async deletePath(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.pathService.deleteOne(id);
  }
}
