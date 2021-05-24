import * as types from '../../../constants/contacts'

export function updateContactTags(contactId: UUID, tags: string[]) {
  return {
    type: types.UPDATE_CONTACT_TAGS,
    contactId,
    tags
  }
}
