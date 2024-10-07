import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

import { ROLE } from '../../auth/constants/role.constant'

export class UpdateUserRolesInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE
}
