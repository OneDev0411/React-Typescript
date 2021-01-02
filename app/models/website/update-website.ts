import Fetch from 'services/fetch'

async function updateWebsite(
  userId: UUID,
  instanceId: UUID,
  data: Pick<IWebsiteTemplateInstance, 'title'>
) {
  await new Fetch().put(`/websites/${instanceId}`).send({
    template: 'light',
    template_instance: null,
    attributes: {},
    user: userId,
    ...data
  })
}

export default updateWebsite
