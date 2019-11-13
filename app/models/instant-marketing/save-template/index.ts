import Fetch from '../../../services/fetch'

interface SaveTemplateArguments {
  name: string
  brandId: string | null
  type: string
  medium: string
  inputs: string[]
}

export async function saveTemplate({
  name,
  brandId,
  type,
  medium,
  inputs = []
}: SaveTemplateArguments) {
  try {
    const response = await new Fetch().post('/templates').send({
      name,
      medium,
      template_type: type,
      brands: [brandId],
      inputs
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
