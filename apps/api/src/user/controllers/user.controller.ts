import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

// import { Roles } from '../../auth/decorators/role.decorator'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import type { BaseApiResponse } from '../../shared/dtos/base-api-response.dto'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto'
import { AppLogger } from '../../shared/logger/logger.service'
import { ReqContext } from '../../shared/request-context/req-context.decorator'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { UserOutput } from '../dtos/user-output.dto'
import { UserParamsDto } from '../dtos/user-params.dto'
import { UpdateUserRolesInput } from '../dtos/user-roles-update.dto'
import { UpdateUserInput } from '../dtos/user-update-input.dto'
import { UserService } from '../services/user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserController.name)
  }

  // * @UseInterceptors(ClassSerializerInterceptor) Disabled because it will transform it twice and ignore the groups on the second one
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`)

    const user = await this.userService.getUserProfile(ctx, ctx.user?.id ?? '')

    return { data: user, meta: {} }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get users as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: UserParamsDto,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    this.logger.log(ctx, `${this.getUsers.name} was called`)

    const { users, count } = await this.userService.getUsers(
      ctx,
      query.limit,
      query.offset,
      query.search,
      query.state,
      query.role,
    )

    return { data: users, meta: { count } }
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use GET /me
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async getUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.getUser.name} was called`)

    const user = await this.userService.getUserById(ctx, id)

    return { data: user, meta: {} }
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use PATCH /me
  @Put(':id')
  @ApiOperation({
    summary: 'Update user API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') userId: string,
    @Body() input: UpdateUserInput,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.updateUser.name} was called`)

    const user = await this.userService.updateUser(ctx, userId, input)

    return { data: user, meta: {} }
  }

  @Patch(':id/role')
  @ApiOperation({
    summary: 'Update user ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUserRole(
    @ReqContext() ctx: RequestContext,
    @Param('id') userId: string,
    @Body() input: UpdateUserRolesInput,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.updateUserRole.name} was called`)

    const user = await this.userService.updateUserRole(ctx, userId, input)

    return { data: user, meta: {} }
  }
}
