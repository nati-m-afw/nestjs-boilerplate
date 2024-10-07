import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator'

export class UpdateUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  username: string

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
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  birthDate: string

  @ApiPropertyOptional()
  @IsUUID('4')
  state: string
}
