import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import type { DataLookupType } from '../../shared/constants/lookup-type'
import type { DataLookupValue } from '../../shared/constants/lookup-value'
import { DataLookup } from '../entities/data-lookup.entity'
import { DataLookupNotFoundException } from '../exceptions/data-lookup-not-found.exception'

@Injectable()
export class DataLookupRepository extends Repository<DataLookup> {
  constructor(private dataSource: DataSource) {
    super(DataLookup, dataSource.createEntityManager())
  }

  async getById(id: string): Promise<DataLookup> {
    const dataLookup = await this.findOne({ where: { id } })

    if (!dataLookup) {
      throw DataLookupNotFoundException.withId(id)
    }

    return dataLookup
  }

  async getDefaultType(type: DataLookupType): Promise<DataLookup> {
    const dataLookup = await this.findOne({ where: { type, isDefault: true } })

    if (!dataLookup) {
      throw DataLookupNotFoundException.withDefaultType(type)
    }

    return dataLookup
  }

  async getByValue(value: DataLookupValue): Promise<DataLookup> {
    const dataLookup = await this.findOne({ where: { value } })

    if (!dataLookup) {
      throw DataLookupNotFoundException.withValue(value)
    }

    return dataLookup
  }

  async getByType(type: DataLookupType): Promise<DataLookup[]> {
    const dataLookups = await this.find({ where: { type } })

    if (!dataLookups) {
      throw DataLookupNotFoundException.withType(type)
    }

    return dataLookups
  }
}
