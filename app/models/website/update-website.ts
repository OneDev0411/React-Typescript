import Fetch from 'services/fetch'

async function updateWebsite(
  instanceId: UUID,
  data: Pick<IWebsiteTemplateInstance, 'title'>
) {
  await new Fetch().put(`/websites/${instanceId}`).send(data)
}

export default updateWebsite
