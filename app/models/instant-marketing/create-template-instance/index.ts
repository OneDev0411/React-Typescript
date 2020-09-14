import Fetch from '../../../services/fetch'

interface TemplateInstanceInputData {
  html: string
  deals?: UUID[]
  listings?: UUID[]
  contacts?: UUID[]
}

export async function createTemplateInstance(
  templateId: UUID,
  data: TemplateInstanceInputData
): Promise<IMarketingTemplateInstance> {
  try {
    const response = await new Fetch()
      .post(`/templates/${templateId}/instances`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
