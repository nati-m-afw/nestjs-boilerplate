import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy'
import { UserAclService } from './acl/user.acl'
import { UserController } from './controllers/user.controller'
import { OTP } from './entities/otp.entity'
import { User } from './entities/user.entity'
import { UserSettings } from './entities/user-settings.entity'
import { UserRepository } from './repositories/user.repository'
import { UserSettingsRepository } from './repositories/user-settings.repository'
import { UserService } from './services/user.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, UserSettings, OTP])],
  providers: [
    UserService,
    JwtAuthStrategy,
    UserAclService,
    UserRepository,
    UserSettingsRepository,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
