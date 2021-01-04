import Fetch from 'services/fetch'

async function getWebsiteTemplates(brandId: UUID) {
  return (
    await new Fetch().get(`/brands/${brandId}/templates?mediums[]=Website`)
  ).body.data as IWebsiteTemplate[]
}

export default getWebsiteTemplates
