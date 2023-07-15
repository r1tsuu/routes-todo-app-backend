import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathModule } from './path/path.module';
import { loadConfiguration } from './config/load-configuration';
import { Path } from './path/path.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DB_URL'),
        logging: true,
        entities: [Path],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PathModule,
  ],
})
export class AppModule {}
