import Fetch from '../../services/fetch'

export async function getEmailTemplates(
  brand: UUID,
  query: object = {}
): Promise<IBrandEmailTemplate[]> {
  try {
    const response = await new Fetch()
      .get(`/brands/${brand}/emails/templates`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
