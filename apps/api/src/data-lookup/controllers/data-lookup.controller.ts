import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import type { BaseApiResponse } from '../../shared/dtos/base-api-response.dto'
import { SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto'
import { AppLogger } from '../../shared/logger/logger.service'
import { ReqContext } from '../../shared/request-context/req-context.decorator'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { DataLookupOutput } from '../dtos/data-lookup-output.dto'
import { DataLookupQueryParamsDto } from '../dtos/data-lookup-query-params.dto'
import { DataLookupService } from '../services/data-lookup.service'

@Controller('data-lookups')
@ApiTags('data-lookups')
export class DataLookupController {
  constructor(
    private dataLookupService: DataLookupService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(DataLookupController.name)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get data-lookups as list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get data-lookup list',
    type: SwaggerBaseApiResponse([DataLookupOutput]),
  })
  async getAllDataLookup(
    @ReqContext() ctx: RequestContext,
    @Query() query: DataLookupQueryParamsDto,
  ): Promise<BaseApiResponse<DataLookupOutput[]>> {
    this.logger.log(ctx, `${this.getAllDataLookup.name} was called`)

    const { lookups, count } = await this.dataLookupService.getAllDataLookup(
      ctx,
      query.limit,
      query.offset,
    )

    return {
      data: lookups,
      meta: { total: count, page: query.page, limit: query.limit },
    }
  }
}
