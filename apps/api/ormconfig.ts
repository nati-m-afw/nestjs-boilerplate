import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import type { SeederOptions } from 'typeorm-extension'

dotenv.config()

const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + '/src/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  seeds: [__dirname + '/seeders/**/*{.ts,.js}'],
  seedTracking: true,
} as DataSourceOptions & SeederOptions)

export default typeOrmConfig
