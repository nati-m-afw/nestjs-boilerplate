import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateUserSettingsInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isEmailVerified: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPhoneVerified: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  receiveEmails: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  receiveSms: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  receivePushNotifications: boolean
}
