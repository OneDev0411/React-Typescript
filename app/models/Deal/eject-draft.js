import Fetch from '../../services/fetch'

export async function ejectDraftMode(dealId) {
  try {
    return await new Fetch().patch(`/deals/${dealId}/draft`).send({
      is_draft: false
    })
  } catch (e) {
    return null
  }
}

export default {
  ejectDraftMode
}
