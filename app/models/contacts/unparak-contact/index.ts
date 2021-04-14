import Fetch from '../../../services/fetch'

export interface Filters extends IContactFilterOptions {
  attributes?: IContactAttributeFilter[]
}

/**
 * un-park a contact
 * @param {UUID[]} contacts The list of contacts id for un-parking
 * @param {Filters} filters contacts filters
 */

export const unparkContact = async (
  contacts: UUID[],
  filters: Filters = {}
) => {
  let payload

  if (Array.isArray(contacts) && contacts.length > 0) {
    payload = {
      contacts: contacts.map(id => ({
        id,
        parked: false
      }))
    }
  } else {
    payload = {
      ...filters,
      patch: {
        parked: false
      }
    }
  }

  try {
    const response = await new Fetch().patch('/contacts').send(payload)

    return response.body
  } catch (error) {
    throw error
  }
}
