import Fetch from 'services/fetch'

export interface UpdateWebsiteData
  extends Pick<IWebsite, 'template' | 'attributes' | 'title'> {
  user: UUID
  template_instance: UUID
}

async function updateWebsite(instanceId: UUID, data: UpdateWebsiteData) {
  return (await new Fetch().put(`/websites/${instanceId}`).send(data)).body
    .data as IWebsite
}

export default updateWebsite
