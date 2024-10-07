import { NotFoundException } from '@nestjs/common'

import type { DataLookupType } from '../../shared/constants/lookup-type'
import type { DataLookupValue } from '../../shared/constants/lookup-value'

export class DataLookupNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message)
  }

  static withDefaultType(type: DataLookupType) {
    return new DataLookupNotFoundException(`Default ${type} not found`)
  }

  static withId(id: string) {
    return new DataLookupNotFoundException(
      `Data lookup with id ${id} not found`,
    )
  }

  static withTypeAndId(type: DataLookupType, id: string) {
    return new DataLookupNotFoundException(
      `Data lookup with id ${id} and type ${type} not found`,
    )
  }

  static withValue(value: DataLookupValue) {
    return new DataLookupNotFoundException(
      `Data lookup with value ${value} not found`,
    )
  }

  static withType(type: DataLookupType) {
    return new DataLookupNotFoundException(
      `Data lookup with type ${type} not found`,
    )
  }
}
