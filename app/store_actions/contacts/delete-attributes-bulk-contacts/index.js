import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import {
  DELETE_ATTRIBUTES_FROM_CONTACTS_FAILURE,
  DELETE_ATTRIBUTES_FROM_CONTACTS_REQUEST,
  DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS
} from '../../../constants/contacts'
import { deleteAttributesFromContacts as fetchDeleteAttributesFromContacts } from '../../../models/contacts/delete-attributes-bulk-contacts'
import { selectContact } from '../../../reducers/contacts/list'

export function deleteAttributesFromContacts(ids, attributes, attribute_def) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_REQUEST
      })

      await fetchDeleteAttributesFromContacts(attributes)

      const {
        contacts: { list }
      } = getState()
      const contacts = ids.map(contactId => {
        const contact = selectContact(list, contactId)

        const newSubContacts = contact.sub_contacts.map(subContact => {
          if (subContact.attributes[attribute_def.id]) {
            const filteredAttributes = subContact.attributes[
              attribute_def.id
            ].filter(({ id: attributeId }) => !attributes.includes(attributeId))
            const filteredSection = subContact.sections[
              attribute_def.section
            ].filter(({ id: attributeId }) => !attributes.includes(attributeId))

            return {
              ...subContact,
              attributes: {
                ...subContact.attributes,
                [attribute_def.id]: filteredAttributes
              },
              sections: {
                ...subContact.sections,
                [attribute_def.section]: filteredSection
              }
            }
          }

          return {
            ...subContact
          }
        })

        return {
          ...contact,
          sub_contacts: newSubContacts
        }
      })

      dispatch({
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS,
        response: normalize({ contacts }, contactsSchema)
      })
    } catch (error) {
      dispatch({
        error,
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
