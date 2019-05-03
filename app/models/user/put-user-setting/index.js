import _ from 'underscore'

import Fetch from '../../../services/fetch'

/**
 * Put a key value data as user settings data under the specific brand
 * @param {String} key The setting key
 * @param value The setting value
 * @param {UUID} [brand] The active brand id
 * @return {Array} a new setting object
 */
export async function putUserSetting(key, value, brand) {
  if (!key) {
    throw new Error(`key is ${key}.`)
  }

  try {
    const request = new Fetch()
      .put(`/users/self/settings/${key}`)
      .send({ value: _.isEmpty(value) ? null : value })

    if (brand) {
      request.set({ 'X-RECHAT-BRAND': brand })
    }

    return request
  } catch (error) {
    throw error
  }
}
