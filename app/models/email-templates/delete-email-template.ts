import Fetch from '../../services/fetch'

export async function deleteEmailTemplate(
  brand: UUID,
  template: UUID
): Promise<any> {
  try {
    return new Fetch()
      .delete(`/brands/${brand}/emails/templates/${template}`)
  } catch (error) {
    throw error
  }
}
