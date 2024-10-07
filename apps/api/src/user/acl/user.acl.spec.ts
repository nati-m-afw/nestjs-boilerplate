import { Test, TestingModule } from '@nestjs/testing'

import { ROLE } from '../../auth/constants/role.constant'
import { Action } from '../../shared/acl/action.constant'
import { UserAclService } from './user.acl'

describe('UserAclService', () => {
  let service: UserAclService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAclService],
    }).compile()

    service = module.get<UserAclService>(UserAclService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('for admin user', () => {
    let userAcl
    beforeEach(async () => {
      const user = {
        id: 6,
        username: 'admin',
        roles: [ROLE.ADMIN],
      }
      userAcl = service.forActor(user)
    })

    it('should allow admin user to create, read, update, delete, list user', async () => {
      expect(userAcl.canDoAction(Action.CREATE)).toBeTruthy()
      expect(userAcl.canDoAction(Action.READ)).toBeTruthy()
      expect(userAcl.canDoAction(Action.UPDATE)).toBeTruthy()
      expect(userAcl.canDoAction(Action.DELETE)).toBeTruthy()
      expect(userAcl.canDoAction(Action.LIST)).toBeTruthy()
    })

    it('should allow admin to read, update, delete any user', () => {
      const otherUser = {
        id: 7,
      }
      expect(userAcl.canDoAction(Action.READ, otherUser)).toBeTruthy()
      expect(userAcl.canDoAction(Action.UPDATE, otherUser)).toBeTruthy()
      expect(userAcl.canDoAction(Action.DELETE, otherUser)).toBeTruthy()
    })
  })

  describe('for user role', () => {
    let user
    let userAcl

    beforeEach(async () => {
      user = {
        id: 11,
        username: 'jeo',
        roles: [ROLE.USER],
      }
      userAcl = service.forActor(user)
    })

    it('should allow user to read, update himself', async () => {
      expect(userAcl.canDoAction(Action.READ, user)).toBeTruthy()
      expect(userAcl.canDoAction(Action.UPDATE, user)).toBeTruthy()
    })

    it('should not allow user to delete himself', async () => {
      expect(userAcl.canDoAction(Action.DELETE, user)).toBeFalsy()
    })

    it('should allow user to read other user', () => {
      const otherUser = {
        id: 7,
      }
      expect(userAcl.canDoAction(Action.READ, otherUser)).toBeTruthy()
    })

    it('should not allow user to update, delete other user', () => {
      const otherUser = {
        id: 7,
      }
      expect(userAcl.canDoAction(Action.UPDATE, otherUser)).toBeFalsy()
      expect(userAcl.canDoAction(Action.DELETE, otherUser)).toBeFalsy()
    })
  })
})
