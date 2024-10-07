/* eslint-disable lines-between-class-members */
import { Column, Entity } from 'typeorm'

import { AbstractEntity } from '../../shared/entities/abstract.entity'

@Entity({ name: 'data_lookups' })
export class DataLookup extends AbstractEntity {
  @Column()
  type: string

  @Column()
  value: string

  @Column()
  description: string

  @Column({ default: '' })
  note: string

  @Column()
  category: string

  @Column()
  index: number

  @Column()
  isDefault: boolean

  @Column()
  isActive: boolean

  @Column({ type: String, nullable: true })
  remark: string | null
}
