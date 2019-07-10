import { isEmpty } from 'lodash'

import Fetch from 'services/fetch'

/**
 * Put a key value data as team settings
 * @param {String} key The setting key
 * @param value The setting value
 * @param {UUID} [brand] The active brand id
 * @return {Array} a new setting object
 */
export async function putTeamSetting(
  key: string,
  value: string | number | boolean | Date,
  brand
) {
  return new Fetch()
    .put(`/brands/${brand}/settings/${key}`)
    .send({ value: value == null ? null : value })
}
