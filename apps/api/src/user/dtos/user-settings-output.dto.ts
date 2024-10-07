import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { AbstractDto } from '../../shared/dtos/abstract.dto'

export class UserSettingsOutput extends AbstractDto {
  @Expose()
  @ApiProperty({ type: 'boolean', default: false })
  isEmailVerified: boolean

  @Expose()
  @ApiProperty({ type: 'boolean', default: false })
  isPhoneVerified: boolean

  @Expose()
  @ApiProperty({ type: 'boolean', default: true })
  receiveEmails: boolean

  @Expose()
  @ApiProperty({ type: 'boolean', default: true })
  receiveSms: boolean

  @Expose()
  @ApiProperty({ type: 'boolean', default: true })
  receivePushNotifications: boolean
}
