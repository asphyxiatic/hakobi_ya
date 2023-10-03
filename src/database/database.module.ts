import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config.js';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error(
            ' incorrect options for connecting to the database!!!',
          );
        }

        const appDataSource = new DataSource(options).initialize();
        return appDataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
