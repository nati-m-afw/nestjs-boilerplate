import { Injectable } from '@nestjs/common'

import { ROLE } from '../../auth/constants/role.constant'
import { BaseAclService } from '../../shared/acl/acl.service'
import { Action } from '../../shared/acl/action.constant'
import { User } from '../entities/user.entity'

@Injectable()
export class UserAclService extends BaseAclService<User> {
  constructor() {
    super()
    this.canDo(ROLE.ADMIN, [Action.Manage])
    this.canDo(ROLE.USER, [Action.Create, Action.List, Action.Read])
    this.canDo(ROLE.USER, [Action.Update, Action.Delete])
  }
}
