import Fetch from 'services/fetch'

async function createWebsite(userId: UUID) {
  return (
    await new Fetch().post('/websites').send({
      template: 'light',
      title: 'New Website Title',
      template_instance: null,
      attributes: {},
      user: userId
    })
  ).body.data as IWebsiteTemplateInstance
}

export default createWebsite
