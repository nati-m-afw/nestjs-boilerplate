import { ApiProperty } from '@nestjs/swagger'
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

import { ROLE } from '../../auth/constants/role.constant'
import { DataLookupOutput } from '../../data-lookup/dtos/data-lookup-output.dto'

export class CreateUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsAlphanumeric()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(18)
  phone: string

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  birthDate: string

  @ApiProperty({ type: DataLookupOutput })
  @IsNotEmpty()
  state: DataLookupOutput

  @ApiProperty({ type: ROLE })
  @IsNotEmpty()
  role: ROLE
}
