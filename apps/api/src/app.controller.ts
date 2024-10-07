import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { AppLogger } from './shared/logger/logger.service'
import { ReqContext } from './shared/request-context/req-context.decorator'
import { RequestContext } from './shared/request-context/request-context.dto'

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
    this.logger.setContext(AppController.name)
  }

  @Get()
  ping(@ReqContext() ctx: RequestContext): string {
    return 'pong'
  }
}
