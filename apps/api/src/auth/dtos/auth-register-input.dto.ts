import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  name: string

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
  @IsDateString()
  birthDate: string
}
