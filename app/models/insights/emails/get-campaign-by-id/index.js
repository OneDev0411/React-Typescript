import Fetch from '../../../../services/fetch'

async function getById(id) {
  // const { access_token } = user

  const endpoint = `/emails/${id}?associations[]=email_campaign.emails&associations[]=email_campaign.from`

  try {
    const fetchCampaign = new Fetch().get(endpoint)
    const response = await fetchCampaign

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getById
