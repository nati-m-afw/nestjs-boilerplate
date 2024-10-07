import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date
}
