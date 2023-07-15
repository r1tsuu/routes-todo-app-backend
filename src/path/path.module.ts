import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Path } from './path.entity';
import { PathService } from './path.service';
import { PathController } from './path.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Path])],
  providers: [PathService],
  controllers: [PathController],
})
export class PathModule {}
