import Fetch from '../../services/fetch'

export async function updateEmailTemplate(
  brand: UUID,
  id: UUID,
  updates: IBrandEmailTemplateInput
): Promise<IBrandEmailTemplate> {
  try {
    const response = await new Fetch()
      .put(`/brands/${brand}/emails/templates/${id}`)
      .send(updates)

    return response.body.data
  } catch (error) {
    throw error.response?.body ?? error.message
  }
}
