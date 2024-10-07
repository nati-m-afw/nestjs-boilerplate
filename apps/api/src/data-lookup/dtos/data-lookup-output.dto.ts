import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { AbstractDto } from '../../shared/dtos/abstract.dto'

export class DataLookupOutput extends AbstractDto {
  @Expose()
  @ApiProperty()
  type: string

  @Expose()
  @ApiProperty()
  value: string

  @Expose()
  @ApiProperty()
  description: string

  @Expose()
  @ApiProperty()
  note: string

  @Expose()
  @ApiProperty()
  category: string

  @Expose()
  @ApiProperty()
  index: number

  @Expose()
  @ApiProperty()
  isDefault: boolean

  @Expose()
  @ApiProperty()
  isActive: boolean

  @Expose()
  @ApiPropertyOptional()
  remark: string | null
}
