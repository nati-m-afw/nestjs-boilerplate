import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'

export class UserParamsDto extends PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Search by name, email, username, or phone number',
    type: String,
  })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    description: 'Filter by status',
    type: String,
  })
  @IsUUID(4, { message: 'Must be a valid UUID' })
  @IsOptional()
  state?: string

  @ApiPropertyOptional({
    description: 'Filter by role',
    type: String,
  })
  @IsUUID(4, { message: 'Must be a valid UUID' })
  @IsOptional()
  role?: string
}
