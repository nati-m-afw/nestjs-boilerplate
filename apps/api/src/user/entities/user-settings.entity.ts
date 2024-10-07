import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { AbstractEntity } from '../../shared/entities/abstract.entity'
import { User } from './user.entity'

@Entity({ name: 'user_settings' })
export class UserSettings extends AbstractEntity {
  @Column({ default: false })
  isEmailVerified?: boolean

  @Column({ default: false })
  isPhoneVerified?: boolean

  @Column({ default: true })
  receiveEmails?: boolean

  @Column({ default: true })
  receiveSms?: boolean

  @Column({ default: true })
  receivePushNotifications?: boolean

  @OneToOne(() => User, (user) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  user?: User
}
