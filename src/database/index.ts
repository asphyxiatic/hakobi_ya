import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config/config.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { HouseEntity } from '../houses/entities/house.entity.js';
import { EntranceEntity } from '../entrances/entities/entrance.entity.js';
import { TokenEntity } from '../tokens/entities/token.entity.js';
import { StreetEntity } from '../streets/entities/street.entity.js';

export const appDataSource = new DataSource({
  type: 'postgres',
  entities: [
    UserEntity,
    TokenEntity,
    StreetEntity,
    HouseEntity,
    EntranceEntity,
  ],
  url: config.DB_URL,
  migrationsTableName: 'migrations_table',
  migrations: ['./dist/src/database/migrations/*.js'],
} as DataSourceOptions);
