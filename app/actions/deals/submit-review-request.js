import _ from 'underscore'
import { submitReviewRequest } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (
  id,
  body,
  token
) {
  const params = {
    id,
    body,
    token
  }
  try {
    // request for submit
    const nextReviews = await submitReviewRequest(params)
    // const nextReviewsIndexed = _.indexBy(nextReviews, 'id')
    // const { list } = AppStore.data.deals
    // const deal = AppStore.data.deals.list[id]
    // const newReviews = deal.reviews.map((review) => {
    //   // deal id
    //   const newReview = nextReviewsIndexed[review.id]

    //   if (!newReview)
    //     return review

    //   return newReview
    // })
    // list[id].reviews = newReviews
    // AppStore.data.deals.list = list
    return nextReviews
  } catch (e) {}
}
