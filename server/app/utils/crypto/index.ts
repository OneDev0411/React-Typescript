import crypto from 'crypto'

import config from '../../../config'

const ALGORITHM = 'aes-256-ctr'

const key = crypto
  .createHash('sha256')
  .update(config.crypto_key!, 'ascii')
  .digest()

export function encrypt(data: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, key, config.crypto_iv!)
  let crypted = cipher.update(data, 'utf8', 'base64')

  crypted += cipher.final('base64')

  return crypted
}

export function decrypt(data: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, config.crypto_iv!)
  let dec = decipher.update(data, 'base64', 'utf8')

  dec += decipher.final('utf8')

  return dec
}
