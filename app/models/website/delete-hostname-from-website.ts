import Fetch from 'services/fetch'

interface DeleteHostnameFromWebsiteData {
  hostname: string
}

async function deleteHostnameFromWebsite(
  websiteId: IWebsite['id'],
  data: DeleteHostnameFromWebsiteData
) {
  return (
    await new Fetch()
      .delete(`/websites/${websiteId}/hostnames?hostname=${data.hostname}`)
      .send({ ...data, id: websiteId })
  ).body.data
}

export default deleteHostnameFromWebsite
