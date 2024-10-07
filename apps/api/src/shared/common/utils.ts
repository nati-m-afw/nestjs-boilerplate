import bcrypt from 'bcryptjs'

export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): boolean {
  if (!password || !hash) {
    return false
  }

  return bcrypt.compareSync(password, hash)
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  )

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    )
  }

  const fullMemberName = m[1]

  const memberParts = fullMemberName.split('.')

  // eslint-disable-next-line unicorn/prefer-at
  return memberParts[memberParts.length - 1]
}

export function generateRandomString(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export function generateOTP(length: number): string {
  const chars = '0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}
