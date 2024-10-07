import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

import type { RequestContext } from './request-context.dto'
import { createRequestContext } from './util'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return createRequestContext(request)
  },
)
