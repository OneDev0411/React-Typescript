import { isEmpty } from 'lodash'

import Fetch from '../../../services/fetch'

function sanitizeSettingValue(value: any): any {
  // isEmpty always returns true for boolean and number type so we need to handle it
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value
  }

  if (isEmpty(value)) {
    return null
  }

  return value
}

/**
 * Put a key value data as user settings data under the specific brand
 * @param {String} key The setting key
 * @param value The setting value
 * @param {UUID} [brand] The active brand id
 * @return {Array} a new setting object
 */
export async function putUserSetting(key: string, value: any, brand?: UUID) {
  if (!key) {
    throw new Error(`key is ${key}.`)
  }

  try {
    const request = new Fetch()
      .put(`/users/self/settings/${key}`)
      .send({ value: sanitizeSettingValue(value) })

    if (brand) {
      request.set({ 'X-RECHAT-BRAND': brand })
    }

    return request
  } catch (error) {
    throw error
  }
}
