import { getTouchAssociations } from '../../../../../models/crm-touches/get-touch-associations'
import { normalizeAssociations } from '../../../../utils/association-normalizers'

/**
 * Fetch and normalize touch assosiations
 * @param {UUID} touchId The touch id
 * @returns {array} a normalized array of associations
 */
export async function getAssociations(touch) {
  try {
    let query = []
    const types = ['deal', 'contact', 'listing']
    const queryName = 'associations[]=crm_association.'

    types.forEach(type => {
      const value = touch[`${type}s`]

      if (value && value.length > 0) {
        query.push(`${queryName}${type}`)

        if (type === 'contact') {
          query.push('associations[]=contact.summary')
        }
      }
    })

    if (query.length > 0) {
      const records = await getTouchAssociations(touch.id, query.join('&'))

      return normalizeAssociations(records)
    }

    return query
  } catch (error) {
    throw error
  }
}
