import Fetch from '../../services/fetch'

export async function getEmailTemplates(
  brand: UUID
): Promise<IBrandEmailTemplate[]> {
  try {
    const response = await new Fetch().get(`/brands/${brand}/emails/templates`)

    return response.body.data
  } catch (error) {
    throw error
  }
}
