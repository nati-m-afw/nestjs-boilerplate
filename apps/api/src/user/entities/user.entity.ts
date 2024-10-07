import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm'

import { ROLE } from '../../auth/constants/role.constant'
import { DataLookup } from '../../data-lookup/entities/data-lookup.entity'
import { AbstractEntity } from '../../shared/entities/abstract.entity'
import { OTP } from './otp.entity'
import { UserSettings } from './user-settings.entity'

@Entity('users')
export class User extends AbstractEntity {
  @Column({ length: 100 })
  name: string

  @Column()
  password: string

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string

  @ManyToOne(() => DataLookup, { eager: true })
  @JoinColumn({ name: 'state' })
  state: DataLookup

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string

  @Column({ type: 'date' })
  birthDate: string

  @Column({ length: 18 })
  phone: string

  @Column({ type: 'enum', enum: ROLE })
  role: ROLE

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user)
  @JoinColumn({ name: 'settings' })
  settings: UserSettings

  @OneToMany(() => OTP, (otp) => otp.user)
  otp: OTP[]

  @Column({ nullable: true, type: 'text' })
  refreshToken: string | null
}
