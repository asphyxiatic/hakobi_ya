import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config.js';
import { DataSource, DataSourceOptions } from 'typeorm';
import { INVALID_DATABASE_OPTIONS } from '../common/errors/errors.constants.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        if (!options) throw new Error(INVALID_DATABASE_OPTIONS);

        const appDataSource = new DataSource(options).initialize();
        return appDataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
