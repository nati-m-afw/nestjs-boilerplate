import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource, In, Repository } from 'typeorm'

import { User } from '../entities/user.entity'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  async getById(id: string): Promise<User> {
    const user = await this.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  async getByIds(ids: string[]): Promise<User[]> {
    return this.find({ where: { id: In(ids) } })
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.settings', 'settings')
      .leftJoinAndSelect('user.state', 'state')
      .where('user.id = :id', { id })
      .getOne()

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  async getUserProfileByEmail(email: string): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.settings', 'settings')
      .leftJoinAndSelect('user.state', 'state')
      .where('user.email = :email', { email })
      .getOne()

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }
}
