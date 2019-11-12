import Fetch from '../../../services/fetch'

export async function saveTemplate({
  name,
  brandId,
  type,
  medium,
  inputs = []
}) {
  try {
    const response = await new Fetch().post('/templates').send({
      name,
      medium,
      type,
      brands: [brandId],
      inputs
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
