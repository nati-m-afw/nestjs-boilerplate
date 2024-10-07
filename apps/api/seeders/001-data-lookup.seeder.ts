/* eslint-disable no-await-in-loop */
import type { DataSource } from 'typeorm'
import type { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { dataLookupFixtures } from '../fixtures/data-lookup.fixture'
import { DataLookup } from '../src/data-lookup/entities/data-lookup.entity'

export default class DataLookupSeeder implements Seeder {
  public async run(dataSource: DataSource, _: SeederFactoryManager) {
    const repository = dataSource.getRepository(DataLookup)

    for (const fixture of dataLookupFixtures) {
      const hasMatch = await repository.existsBy({
        value: fixture.value,
      })

      console.info(
        `${DataLookup.name} has match (${fixture.value}): ${hasMatch}`,
      )

      if (hasMatch) {
        continue
      }

      await repository.insert(fixture)
    }
  }
}
