import Fetch from '../../services/fetch'

export async function createEmailTemplate(
  brand: UUID,
  template: IBrandEmailTemplateInput
): Promise<IBrandEmailTemplate> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/emails/templates`)
      .send(template)

    return response.body.data
  } catch (error) {
    throw error.response?.body ?? error.message
  }
}
