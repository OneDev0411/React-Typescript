// crypto.js
import crypto from 'crypto'
import config from '../../../config/private'

const ALGORITHM = 'aes-256-ctr'

const { iv } = config.crypto
const key = crypto
  .createHash('sha256')
  .update(config.crypto.key, 'ascii')
  .digest()

const encrypt = data => {
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let crypted = cipher.update(data, 'utf8', 'base64')

  crypted += cipher.final('base64')

  return crypted
}

const decrypt = data => {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let dec = decipher.update(data, 'base64', 'utf8')

  dec += decipher.final('utf8')

  return dec
}

export default {
  encrypt,
  decrypt
}
