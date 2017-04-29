// actions/deals/create-envelope.js
import _ from 'underscore'
import Deal from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (user, deal_id, subject, documents, recipients) {
  const params = {
    deal_id,
    subject,
    documents,
    recipients,
    access_token: user.access_token
  }

  try {
    const response = await Deal.collectSignatures(params)
    if (response.status === 200) {
      const envelope = response.body.data
      const deal = AppStore.data.deals.list[deal_id]

      if (deal.envelopes)
        deal.envelopes.unshift(envelope)
      else
        deal.envelopes = [envelope]
    }
  }
  catch(e) {
    throw e
  }
}
