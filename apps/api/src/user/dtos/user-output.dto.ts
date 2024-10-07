import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'

import { ROLE } from '../../auth/constants/role.constant'
import { DataLookupOutput } from '../../data-lookup/dtos/data-lookup-output.dto'
import { DtoType } from '../../shared/constants/dto-group'
import { AbstractDto } from '../../shared/dtos/abstract.dto'
import { UserSettingsOutput } from './user-settings-output.dto'

export class UserOutput extends AbstractDto {
  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  username: string

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty({ type: 'date' })
  birthDate: string

  @Expose()
  @ApiProperty()
  phone: string

  @Expose()
  @Type(() => DataLookupOutput)
  @ApiProperty({ type: () => DataLookupOutput })
  state: DataLookupOutput

  @Expose({ groups: [DtoType.FULL] })
  @Type(() => UserSettingsOutput)
  @ApiPropertyOptional({ type: () => UserSettingsOutput })
  settings: UserSettingsOutput

  @Expose()
  @ApiPropertyOptional({ type: 'enum', enum: ROLE })
  role: ROLE
}
