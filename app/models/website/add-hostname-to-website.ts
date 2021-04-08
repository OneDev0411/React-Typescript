import Fetch from 'services/fetch'

interface AddHostnameToWebsiteData {
  hostname: string
  is_default: boolean
}

async function addHostnameToWebsite(
  websiteId: IWebsite['id'],
  data: AddHostnameToWebsiteData
) {
  return (
    await new Fetch()
      .post(`/websites/${websiteId}/hostnames`)
      .send({ ...data, website: websiteId })
  ).body.data
}

export default addHostnameToWebsite
