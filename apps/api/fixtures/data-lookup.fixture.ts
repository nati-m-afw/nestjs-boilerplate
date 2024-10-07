interface IDataLookupFixture {
  type: string
  value: string
  description: string
  note: string
  category: string
  index: number
  isDefault: boolean
  isActive: boolean
  remark: string | null
}

export const dataLookupFixtures: IDataLookupFixture[] = [
  /**
   ** Object States
   */
  {
    type: 'object_state',
    value: 'object_state_draft',
    description: 'Draft',
    note: '',
    category: 'COMMON',
    index: 0,
    isDefault: true,
    isActive: true,
    remark: '#555555',
  },
  {
    type: 'object_state',
    value: 'object_state_active',
    description: 'Active',
    note: '',
    category: 'COMMON',
    index: 1,
    isDefault: false,
    isActive: true,
    remark: '#00aa00',
  },
  {
    type: 'object_state',
    value: 'object_state_inactive',
    description: 'Inactive',
    note: '',
    category: 'COMMON',
    index: 2,
    isDefault: false,
    isActive: true,
    remark: '#aa0000',
  },
  {
    type: 'object_state',
    value: 'object_state_blocked',
    description: 'Blocked',
    note: '',
    category: 'COMMON',
    index: 3,
    isDefault: false,
    isActive: true,
    remark: '#aa0000',
  },
  {
    type: 'object_state',
    value: 'object_state_deleted',
    description: 'Deleted',
    note: '',
    category: 'COMMON',
    index: 4,
    isDefault: false,
    isActive: true,
    remark: '#aa0000',
  },
  /**
   ** User States
   */
  {
    type: 'user_state',
    value: 'user_state_active',
    description: 'Active',
    note: '',
    category: 'COMMON',
    index: 0,
    isDefault: true,
    isActive: true,
    remark: '#00aa00',
  },
  {
    type: 'user_state',
    value: 'user_state_inactive',
    description: 'Inactive',
    note: '',
    category: 'COMMON',
    index: 1,
    isDefault: false,
    isActive: true,
    remark: '#aa0000',
  },
  {
    type: 'user_state',
    value: 'user_state_blocked',
    description: 'Blocked',
    note: '',
    category: 'COMMON',
    index: 2,
    isDefault: false,
    isActive: true,
    remark: '#aa0000',
  },
  {
    type: 'user_state',
    value: 'user_state_pending',
    description: 'Pending',
    note: '',
    category: 'COMMON',
    index: 3,
    isDefault: false,
    isActive: true,
    remark: '#555555',
  },
  {
    type: 'user_state',
    value: 'user_state_incomplete',
    description: 'Incomplete',
    note: '',
    category: 'COMMON',
    index: 4,
    isDefault: false,
    isActive: true,
    remark: '#555555',
  },
  /**
   ** Sex
   */
  {
    type: 'user_sex',
    value: 'user_sex_male',
    description: 'Male',
    note: '',
    category: 'COMMON',
    index: 0,
    isDefault: false,
    isActive: true,
    remark: null,
  },
  {
    type: 'user_sex',
    value: 'user_sex_female',
    description: 'Female',
    note: '',
    category: 'COMMON',
    index: 1,
    isDefault: false,
    isActive: true,
    remark: null,
  },
]
