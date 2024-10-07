import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import type { User } from '../entities/user.entity'
import { UserSettings } from '../entities/user-settings.entity'

@Injectable()
export class UserSettingsRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(UserSettings, dataSource.createEntityManager())
  }
}
