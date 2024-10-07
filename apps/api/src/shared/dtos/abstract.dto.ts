import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export abstract class AbstractDto {
  @Expose()
  @ApiProperty()
  id: string

  @Expose()
  @ApiProperty()
  createdAt: string

  @Expose()
  @ApiProperty()
  updatedAt: string
}
