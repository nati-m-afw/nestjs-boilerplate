import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DataLookupModule } from './data-lookup/data-lookup.module'
import { SharedModule } from './shared/shared.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [SharedModule, DataLookupModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
