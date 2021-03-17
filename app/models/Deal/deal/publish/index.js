import Fetch from '../../../../services/fetch'

export async function publish(dealId) {
  try {
    return await new Fetch().patch(`/deals/${dealId}/draft`).send({
      is_draft: false
    })
  } catch (e) {
    return null
  }
}
