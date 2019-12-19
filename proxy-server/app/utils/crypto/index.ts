import crypto from 'crypto'

import config from '../../../../config/private'

const ALGORITHM = 'aes-256-ctr'

const { iv } = config.crypto
const key = crypto
  .createHash('sha256')
  .update(config.crypto.key, 'ascii')
  .digest()

export function encrypt(data: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let string = cipher.update(data, 'utf8', 'base64')

  string += cipher.final('base64')

  return string
}

export function decrypt(data: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let dec = decipher.update(data, 'base64', 'utf8')

  dec += decipher.final('utf8')

  return dec
}
