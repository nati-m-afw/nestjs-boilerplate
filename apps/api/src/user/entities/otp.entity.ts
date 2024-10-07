import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { AbstractEntity } from '../../shared/entities/abstract.entity'
import { User } from './user.entity'

@Entity({ name: 'otp' })
export class OTP extends AbstractEntity {
  @Column()
  code: string

  @Column({
    type: 'timestamp',
    default: () => "NOW() + INTERVAL '5 minutes'",
  })
  expiresAt: Date

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user' })
  user: User
}
