// Crypto.js
import config from '../../config/private'
import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const key = crypto.createHash('sha256').update(config.crypto.key, 'ascii').digest()
const iv = config.crypto.iv

export default {

  encrypt: (data) => {
    var cipher = crypto.createCipheriv(algorithm, key, iv)
    var crypted = cipher.update(data, 'utf8', 'base64')
    crypted += cipher.final('base64')
    return crypted
  },

  decrypt: (data) => {
    var decipher = crypto.createDecipheriv(algorithm, key, iv)
    var dec = decipher.update(data, 'base64', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }
}