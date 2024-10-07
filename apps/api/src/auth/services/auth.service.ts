import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'

import { DataLookupService } from '../../data-lookup/services/data-lookup.service'
import { DataLookupType } from '../../shared/constants/lookup-type'
import { AppLogger } from '../../shared/logger/logger.service'
import type { RequestContext } from '../../shared/request-context/request-context.dto'
import type { CreateUserInput } from '../../user/dtos/user-create-input.dto'
import type { UserOutput } from '../../user/dtos/user-output.dto'
import type { UpdateUserSettingsInput } from '../../user/dtos/user-settings-update-input.dto'
import { UserService } from '../../user/services/user.service'
import type { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto'
import type { RegisterInput } from '../dtos/auth-register-input.dto'
import type { UserAccessTokenClaims } from '../dtos/auth-token-output.dto'
import { AuthTokenOutput } from '../dtos/auth-token-output.dto'
import { ROLE } from 'auth/constants/role.constant'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataLookupService: DataLookupService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name)
  }

  async validateUser(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    this.logger.log(ctx, `${this.validateUser.name} was called`)

    // The userService will throw Unauthorized in case of invalid email/password.
    // ! Remove below comment for clean up
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const user = await this.userService.validateEmailPassword(ctx, email, pass)

    // TODO: Prevent disabled users from logging in.
    // if (user.isAccountDisabled) {
    //   throw new UnauthorizedException('This user account has been disabled')
    // }

    return user
  }

  async login(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.login.name} was called`)

    const user = await this.userService.validateEmailPassword(ctx, email, pass)

    return this.getAuthToken(ctx, user)
  }

  async register(
    ctx: RequestContext,
    input: RegisterInput,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.register.name} was called`)

    const defaultState = await this.dataLookupService.getDefaultDataLookup(
      ctx,
      DataLookupType.USER_STATE,
    )

    const defaultRole = ROLE.USER

    const username = await this.userService.generateUsername(ctx, input.name)

    const userInput: CreateUserInput = {
      ...input,
      username,
      state: defaultState,
      role: defaultRole,
    }

    const userSettingsInput: UpdateUserSettingsInput = {
      isEmailVerified: false,
      isPhoneVerified: false,
      receiveEmails: true,
      receiveSms: true,
      receivePushNotifications: true,
    }

    const user = await this.userService.createUser(
      ctx,
      userInput,
      userSettingsInput,
    )

    return this.getAuthToken(ctx, user)
  }

  async refreshToken(
    ctx: RequestContext,
    credential: RefreshTokenInput,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`)

    const user = await this.userService.validateRefreshToken(
      ctx,
      ctx.user?.id ?? '',
      credential.refreshToken,
    )

    const authToken = this.getAuthToken(ctx, user)

    await this.userService.updateRefreshToken(
      ctx,
      user.id,
      authToken.refreshToken,
    )

    return authToken
  }

  getAuthToken(
    ctx: RequestContext,
    user: UserAccessTokenClaims | UserOutput,
  ): AuthTokenOutput {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`)

    const subject = { sub: user.id }
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    }

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    }

    void this.userService.updateRefreshToken(
      ctx,
      user.id,
      authToken.refreshToken,
    )

    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    })
  }
}
