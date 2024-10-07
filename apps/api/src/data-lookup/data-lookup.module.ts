import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DataLookupController } from './controllers/data-lookup.controller'
import { DataLookup } from './entities/data-lookup.entity'
import { DataLookupRepository } from './repositories/data-lookup.repository'
import { DataLookupService } from './services/data-lookup.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DataLookup])],
  providers: [DataLookupService, DataLookupRepository],
  controllers: [DataLookupController],
  exports: [DataLookupService],
})
export class DataLookupModule {}
