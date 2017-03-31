// Crypto.js
import config from '../../config/private'
import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const key = crypto.createHash('sha256').update(config.crypto.key, 'ascii').digest()
const iv = config.crypto.iv

export default {

  encrypt: (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let crypted = cipher.update(data, 'utf8', 'base64')
    crypted += cipher.final('base64')
    return crypted
  },

  decrypt: (data) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let dec = decipher.update(data, 'base64', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }
}