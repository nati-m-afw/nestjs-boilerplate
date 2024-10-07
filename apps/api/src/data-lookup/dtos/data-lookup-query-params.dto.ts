import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'

export class DataLookupQueryParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Optional, data lookup type',
    type: () => String,
  })
  @IsString()
  @IsOptional()
  type?: string
}
