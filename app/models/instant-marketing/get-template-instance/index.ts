import Fetch from '../../../services/fetch'

interface IGetTemplateInstanceQuery {
  associations?: string[]
  omit?: string[]
}

export async function getTemplateInstance(
  id: UUID,
  query: IGetTemplateInstanceQuery = {
    associations: [
      'template_instance.template',
      'template_instance.deals',
      'template_instance.contacts',
      'template_instance.listings'
    ]
  }
): Promise<IMarketingTemplateInstance> {
  try {
    const response = await new Fetch().get(`/templates/instances/${id}`).query({
      'associations[]': query.associations,
      'omit[]': query.omit
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
