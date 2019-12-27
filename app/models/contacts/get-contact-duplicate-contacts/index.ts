import Fetch from '../../../services/fetch'

export interface DuplicateContacts {
  id: number
  contacts: IContact[]
}

export async function getContactDuplicateContacts(
  contactId: UUID
): Promise<DuplicateContacts> {
  try {
    const response = await new Fetch().get(`/contacts/${contactId}/duplicates`)

    return response.body.data
  } catch (error) {
    throw error
  }
}
