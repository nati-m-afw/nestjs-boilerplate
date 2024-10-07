import { Injectable, UnauthorizedException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { QueryFailedError } from 'typeorm'

import { generateHash, validateHash } from '../../shared/common/utils'
import { DtoType } from '../../shared/constants/dto-group'
import { AppLogger } from '../../shared/logger/logger.service'
import type { RequestContext } from '../../shared/request-context/request-context.dto'
import type { CreateUserInput } from '../dtos/user-create-input.dto'
import { UserOutput } from '../dtos/user-output.dto'
import type { UpdateUserRolesInput } from '../dtos/user-roles-update.dto'
import type { UpdateUserSettingsInput } from '../dtos/user-settings-update-input.dto'
import type { UpdateUserInput } from '../dtos/user-update-input.dto'
import { User } from '../entities/user.entity'
import { UserSettings } from '../entities/user-settings.entity'
import { DuplicateEmailException } from '../exceptions/duplicate-email.exception'
import { UserRepository } from '../repositories/user.repository'
import { UserSettingsRepository } from '../repositories/user-settings.repository'

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private userSettingsRepository: UserSettingsRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name)
  }

  async createUser(
    ctx: RequestContext,
    input: CreateUserInput,
    userSettingsInput: UpdateUserSettingsInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.createUser.name} was called`)

    const user = plainToInstance(User, input)

    const userSettings = plainToInstance(UserSettings, userSettingsInput)

    this.logger.log(
      ctx,
      `calling ${UserSettingsRepository.name}.saveUserSettings`,
    )
    await this.userSettingsRepository.save(userSettings)

    user.settings = userSettings
    user.password = generateHash(user.password)

    this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`)

    try {
      await this.repository.save(user)
    } catch (error) {
      this.logger.error(ctx, `Error: ${error.message} - ${error.stack}`)

      throw error instanceof QueryFailedError && error.message.includes('email')
        ? new DuplicateEmailException(input.email)
        : error
    }

    userSettings.user = user

    this.logger.log(
      ctx,
      `calling ${UserSettingsRepository.name}.saveUserSettings`,
    )
    await this.userSettingsRepository.save(userSettings)

    const userWithRoles = await this.repository.getUserProfile(user.id)

    return plainToInstance(UserOutput, userWithRoles, {
      excludeExtraneousValues: true,
      groups: [DtoType.FULL],
    })
  }

  async validateEmailPassword(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.validateEmailPassword.name} was called`)

    try {
      this.logger.log(ctx, `calling ${UserRepository.name}.findOne`)

      const user = await this.repository.getUserProfileByEmail(email)
      const isMatch = validateHash(pass, user.password)

      if (!isMatch) {
        throw new UnauthorizedException()
      }

      return plainToInstance(UserOutput, user, {
        excludeExtraneousValues: true,
        groups: [DtoType.FULL],
      })
    } catch {
      throw new UnauthorizedException()
    }
  }

  async validateRefreshToken(
    ctx: RequestContext,
    userId: string,
    refreshToken: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.validateRefreshToken.name} was called`)

    try {
      this.logger.log(ctx, `calling ${UserRepository.name}.findOne`)

      const user = await this.repository.getUserProfile(userId)

      const isMatch = validateHash(refreshToken, user.refreshToken ?? '')

      if (!isMatch) {
        throw new UnauthorizedException()
      }

      return plainToInstance(UserOutput, user, {
        excludeExtraneousValues: true,
        groups: [DtoType.FULL],
      })
    } catch {
      throw new UnauthorizedException()
    }
  }

  async getUsers(
    ctx: RequestContext,
    limit: number,
    offset: number,
    search?: string,
    state?: string,
    role?: string,
  ): Promise<{ users: UserOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getUsers.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.findAndCount`)
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.state', 'state')

    if (search) {
      queryBuilder
        .setParameter('search', `%${search}%`)
        .where('user.name ILIKE :search')
        .orWhere('user.email ILIKE :search')
        .orWhere('user.username ILIKE :search')
        .orWhere('user.phone ILIKE :search')
    }

    if (state) {
      queryBuilder.andWhere('user.state = :state', { state })
    }

    if (role) {
      queryBuilder.andWhere('role = :role', { role })
    }

    const [users, count] = await queryBuilder
      .take(limit)
      .skip(offset)
      .getManyAndCount()

    const usersOutput = plainToInstance(UserOutput, users, {
      excludeExtraneousValues: true,
    })

    return { users: usersOutput, count }
  }

  async getUserProfile(ctx: RequestContext, id: string): Promise<UserOutput> {
    this.logger.log(ctx, `${this.getUserProfile.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`)
    const user = await this.repository.getUserProfile(id)

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
      groups: [DtoType.FULL],
    })
  }

  async getUserById(ctx: RequestContext, id: string): Promise<UserOutput> {
    this.logger.log(ctx, `${this.getUserById.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`)
    const user = await this.repository.getUserProfile(id)

    console.error('User', user)

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
      groups: [DtoType.FULL],
    })
  }

  async getUsersByIds(
    ctx: RequestContext,
    ids: string[],
  ): Promise<UserOutput[]> {
    this.logger.log(ctx, `${this.getUsersByIds.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.getByIds`)
    const users = await this.repository.getByIds(ids)

    return plainToInstance(UserOutput, users, {
      excludeExtraneousValues: true,
    })
  }

  async findByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findByUsername.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`)
    const user = await this.repository.findOne({ where: { username } })

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    })
  }

  async updateUser(
    ctx: RequestContext,
    userId: string,
    input: UpdateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUser.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`)
    const user = await this.repository.getById(userId)

    const updatedUser: User = {
      ...user,
      ...plainToInstance(User, input),
    }

    this.logger.log(ctx, `calling ${UserRepository.name}.save`)
    await this.repository.save(updatedUser)

    return plainToInstance(UserOutput, updatedUser, {
      excludeExtraneousValues: true,
    })
  }

  async updateUserRole(
    ctx: RequestContext,
    userId: string,
    input: UpdateUserRolesInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUserRole.name} was called`)

    const user = await this.repository.getById(userId)

    user.role = input.role

    await this.repository.save(user)

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
      groups: [DtoType.FULL],
    })
  }

  async updateRefreshToken(
    ctx: RequestContext,
    userId: string,
    refreshToken: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateRefreshToken.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`)
    const user = await this.repository.getById(userId)

    user.refreshToken = generateHash(refreshToken)

    this.logger.log(ctx, `calling ${UserRepository.name}.save`)
    await this.repository.save(user)

    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    })
  }

  async generateUsername(
    ctx: RequestContext,
    fullName: string,
  ): Promise<string> {
    this.logger.log(ctx, `${this.generateUsername.name} was called`)

    // Convert full name to lowercase and remove spaces
    const username = fullName
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      .replace(/\W/g, '_')
      .toLowerCase()
      .split(' ')
      .join('.')

    // Check if the generated username already exists, if so, add a random number
    let uniqueUsername = username
    let counter = 1
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let exists = await this.checkIfUsernameExists(ctx, uniqueUsername)

    while (exists) {
      uniqueUsername = `${username}${counter}`
      counter++
      // eslint-disable-next-line no-await-in-loop
      exists = await this.checkIfUsernameExists(ctx, uniqueUsername)
    }

    return uniqueUsername
  }

  private async checkIfUsernameExists(
    ctx: RequestContext,
    username: string,
  ): Promise<boolean> {
    this.logger.log(ctx, `${this.checkIfUsernameExists.name} was called`)

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`)
    const user = await this.repository.findOne({ where: { username } })

    return Boolean(user)
  }
}
