import Fetch from '../../../services/fetch'

export async function deleteTemplateInstance(id) {
  try {
    const response = await new Fetch().delete(`/templates/instances/${id}`)

    const isDeleted = response.status === 204

    if (isDeleted === false) {
      throw new Error('An error occurred while deleting the template.')
    }

    return true
  } catch (e) {
    throw e
  }
}
