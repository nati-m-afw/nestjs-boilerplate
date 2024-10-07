import { ROLE } from '../src/auth/constants/role.constant'

interface IUserFixture {
  name: string
  password: string
  username: string
  email: string
  birthDate: string
  phone: string
  role: ROLE
}

export const userFixtures: IUserFixture[] = [
  {
    name: 'Test Admin',
    password: 'Pass1234!',
    username: 'test_admin',
    email: 'test@admin.com',
    birthDate: '2000-01-01',
    phone: '+251944000000',
    role: ROLE.ADMIN,
  },
]
