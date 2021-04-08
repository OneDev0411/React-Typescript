import Fetch from 'services/fetch'

async function deleteWebsite(instanceId: UUID) {
  await new Fetch().delete(`/websites/${instanceId}`)
}

export default deleteWebsite
