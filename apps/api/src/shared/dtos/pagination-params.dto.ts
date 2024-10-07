import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 10',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(String(value), 10), {
    toClassOnly: true,
  })
  limit = 10

  @ApiPropertyOptional({
    description: 'Optional, defaults to 1',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(String(value), 10), {
    toClassOnly: true,
  })
  page = 1

  get offset(): number {
    return (this.page - 1) * this.limit
  }
}
