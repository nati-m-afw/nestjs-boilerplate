import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import type { BaseApiResponse } from '../../shared/dtos/base-api-response.dto'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto'
import { AppLogger } from '../../shared/logger/logger.service'
import { ReqContext } from '../../shared/request-context/req-context.decorator'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { LoginInput } from '../dtos/auth-login-input.dto'
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto'
import { RegisterInput } from '../dtos/auth-register-input.dto'
import { AuthTokenOutput } from '../dtos/auth-token-output.dto'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { AuthService } from '../services/auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name)
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @ReqContext() ctx: RequestContext,
    @Body() credential: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.login.name} was called`)

    const authToken = await this.authService.login(
      ctx,
      credential.email,
      credential.password,
    )

    return { data: authToken, meta: {} }
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async registerLocal(
    @ReqContext() ctx: RequestContext,
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.register(ctx, input)

    return { data: authToken, meta: {} }
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`)

    const authToken = await this.authService.refreshToken(ctx, credential)

    return { data: authToken, meta: {} }
  }
}
