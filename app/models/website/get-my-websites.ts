import Fetch from 'services/fetch'

async function getMyWebsites() {
  return (
    await new Fetch().get('/websites').query({
      associations: ['template_instance.template', 'template_instance.listings']
    })
  ).body.data as IWebsite[]
}

export default getMyWebsites
