import type { ROLE } from '../../auth/constants/role.constant'

/**
 * The actor who is perfoming the action
 */
export interface Actor {
  id: string

  role: ROLE
}
