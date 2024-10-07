/* eslint-disable no-await-in-loop */
import type { DataSource } from 'typeorm'
import type { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { userFixtures } from '../fixtures/user.fixture'
import { DataLookup } from '../src/data-lookup/entities/data-lookup.entity'
import { DataLookupNotFoundException } from '../src/data-lookup/exceptions/data-lookup-not-found.exception'
import { generateHash } from '../src/shared/common/utils'
import { DataLookupType } from '../src/shared/constants/lookup-type'
import { User } from '../src/user/entities/user.entity'
import { UserSettings } from '../src/user/entities/user-settings.entity'

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, _: SeederFactoryManager) {
    const repository = dataSource.getRepository(User)
    const settingsRepository = dataSource.getRepository(UserSettings)
    const lookupRepository = dataSource.getRepository(DataLookup)

    const defaultState = await lookupRepository.findOne({
      where: { type: DataLookupType.USER_STATE, isDefault: true },
    })

    const defaultUserSettings = {
      isEmailVerified: true,
      isPhoneVerified: true,
      receiveEmails: true,
      receiveSms: true,
      receivePushNotifications: true,
    }

    if (!defaultState) {
      throw DataLookupNotFoundException.withDefaultType(
        DataLookupType.USER_STATE,
      )
    }

    for (const fixture of userFixtures) {
      const hasMatch = await repository.existsBy({
        email: fixture.email,
      })

      console.info(`${User.name} has match (${fixture.email}): ${hasMatch}`)

      if (hasMatch) {
        continue
      }

      const settings = await settingsRepository.save(defaultUserSettings)

      const user = await repository.save({
        ...fixture,
        password: generateHash(fixture.password),
        state: defaultState,
        settings,
      })

      settings.user = user

      await settingsRepository.save(settings)
    }
  }
}
