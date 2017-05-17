import _ from 'underscore'
import { submitReviewRequest } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (id, body, token) {
  const params = {
    id,
    body,
    token
  }
  try {
    // request for submit
    return await submitReviewRequest(params)
  } catch (e) {}
}
