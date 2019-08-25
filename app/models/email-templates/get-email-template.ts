import Fetch from '../../services/fetch'

export async function getEmailTemplate(
  brand: UUID,
  id: UUID
): Promise<IBrandEmailTemplate[]> {
  try {
    const response = await new Fetch().get(
      `/brands/${brand}/emails/templates/${id}`
    )

    return response.body.data
  } catch (error) {
    throw error
  }
}
