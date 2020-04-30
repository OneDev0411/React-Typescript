import Fetch from '../../../services/fetch'

/**
 * Merging contacts to a contact.
 * @param {string} contactId The parent contact's id that other contact will be merged it.
 * @param {array} childIds Ids of the contacts which will be merged to the parent.
 * @returns {object} Returns merged contact.
 */

export async function mergeContact(contactId, sub_contacts) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (!Array.isArray(sub_contacts)) {
    throw new Error('sub_contacts is invalid!')
  }

  if (sub_contacts.length === 0) {
    throw new Error('sub_contacts is empty!')
  }

  const response = await new Fetch().post('/contacts/merge').send({
    clusters: [
      {
        parent: contactId,
        sub_contacts: sub_contacts.filter(item => item !== contactId)
      }
    ]
  })

  return response.body
}
