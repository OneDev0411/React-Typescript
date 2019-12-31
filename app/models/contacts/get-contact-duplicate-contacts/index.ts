import Fetch from '../../../services/fetch'

export interface DuplicateContacts {
  id: number
  contacts: IContact[]
}

export async function getContactDuplicateContacts(
  contactId: UUID
): Promise<ApiResponseBody<DuplicateContacts>> {
  try {
    const response = await new Fetch().get(`/contacts/${contactId}/duplicates`)

    return response.body
  } catch (error) {
    throw error
  }
}
