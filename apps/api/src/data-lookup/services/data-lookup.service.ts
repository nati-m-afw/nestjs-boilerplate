import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import type { DataLookupType } from '../../shared/constants/lookup-type'
import { DataLookupValue } from '../../shared/constants/lookup-value'
import { AppLogger } from '../../shared/logger/logger.service'
import type { RequestContext } from '../../shared/request-context/request-context.dto'
import { DataLookupOutput } from '../dtos/data-lookup-output.dto'
import { DataLookupRepository } from '../repositories/data-lookup.repository'

@Injectable()
export class DataLookupService {
  constructor(
    private repository: DataLookupRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(DataLookupService.name)
  }

  async getAllDataLookup(ctx: RequestContext, limit: number, offset: number) {
    this.logger.log(ctx, `${this.getAllDataLookup.name} was called`)

    const [lookups, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    })

    const lookupsOutput = plainToInstance(DataLookupOutput, lookups, {
      excludeExtraneousValues: true,
    })

    return {
      lookups: lookupsOutput,
      count,
    }
  }

  async getDataLookupById(ctx: RequestContext, id: string) {
    this.logger.log(ctx, `${this.getDataLookupById.name} was called`)

    const dataLookup = await this.repository.getById(id)

    return plainToInstance(DataLookupOutput, dataLookup, {
      excludeExtraneousValues: true,
    })
  }

  async getDataLookupByType(ctx: RequestContext, type: DataLookupType) {
    this.logger.log(ctx, `${this.getDataLookupByType.name} was called`)

    const lookups = await this.repository.getByType(type)

    return plainToInstance(DataLookupOutput, lookups, {
      excludeExtraneousValues: true,
    })
  }

  async getDataLookupByValue(ctx: RequestContext, value: DataLookupValue) {
    this.logger.log(ctx, `${this.getDataLookupByValue.name} was called`)

    const dataLookup = await this.repository.getByValue(value)

    return plainToInstance(DataLookupOutput, dataLookup, {
      excludeExtraneousValues: true,
    })
  }

  async getDefaultDataLookup(
    ctx: RequestContext,
    type: DataLookupType,
  ): Promise<DataLookupOutput> {
    this.logger.log(ctx, `${this.getDefaultDataLookup.name} was called`)

    const dataLookup = await this.repository.getDefaultType(type)

    return plainToInstance(DataLookupOutput, dataLookup, {
      excludeExtraneousValues: true,
    })
  }

  async getActiveObjectState(ctx: RequestContext): Promise<DataLookupOutput> {
    this.logger.log(ctx, `${this.getActiveObjectState.name} was called`)

    const dataLookup = await this.repository.getByValue(
      DataLookupValue.OBJECT_STATE_ACTIVE,
    )

    return plainToInstance(DataLookupOutput, dataLookup, {
      excludeExtraneousValues: true,
    })
  }
}
