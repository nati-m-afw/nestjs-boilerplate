import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { STRATEGY_JWT_AUTH } from '../constants/strategy.constant'
import type { UserAccessTokenClaims } from '../dtos/auth-token-output.dto'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_AUTH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    })
  }

  validate(payload): UserAccessTokenClaims {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    }
  }
}
