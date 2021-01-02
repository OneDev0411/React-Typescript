import Fetch from 'services/fetch'

async function getMyWebsites() {
  return (await new Fetch().get('/websites')).body
    .data as IWebsiteTemplateInstance[]
}

export default getMyWebsites
