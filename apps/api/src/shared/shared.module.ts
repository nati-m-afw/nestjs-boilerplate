import { BullModule } from '@nestjs/bull'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { configModuleOptions } from './configs/module-options'
import { AllExceptionsFilter } from './filters/all-exceptions.filter'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { AppLoggerModule } from './logger/logger.module'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
        // Timezone configured on the Postgres server.
        // This is used to typecast server date/time values to JavaScript Date object and vice versa.
        timezone: configService.get<string>('timezone'),
        synchronize: false,
        debug: configService.get<string>('env') === 'development',
        logging: configService.get<string>('env') === 'development',
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    AppLoggerModule,
  ],
  exports: [AppLoggerModule, ConfigModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
