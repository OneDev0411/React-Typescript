import _ from 'underscore'

import Fetch from '../../../services/fetch'

/**
 * Put a key value data as user settings data under the specific brand
 * @param {String} key The setting key
 * @param {Any} value The setting value
 * @return {Array} a new setting object
 */
export async function putUserSetting(key, value) {
  if (!key) {
    throw new Error(`key is ${key}.`)
  }

  try {
    return new Fetch()
      .put(`/users/self/settings/${key}`)
      .send({ value: _.isEmpty(value) ? null : value })
  } catch (error) {
    throw error
  }
}
