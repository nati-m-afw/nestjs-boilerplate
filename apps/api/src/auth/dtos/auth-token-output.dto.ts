/* eslint-disable max-classes-per-file */
import { Expose } from 'class-transformer'

import { ROLE } from '../constants/role.constant'

export class AuthTokenOutput {
  @Expose()
  accessToken: string

  @Expose()
  refreshToken: string
}

export class UserAccessTokenClaims {
  @Expose()
  id: string

  @Expose()
  username: string

  @Expose()
  role: ROLE
}

export class UserRefreshTokenClaims {
  id: number
}
