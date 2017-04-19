
import { setReview } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

const getDeal = (deals, dealId) => {
  let result = {}
  deals.find((deal, index) => {
    if (deal.id === dealId) {
      result = {
        dealIndex: index,
        deal
      }
    }
  })
  return result
}

export default async function (id, body, user) {
  const params = {
    id,
    body,
    token: user.access_token
  }
  try {
    const res = await setReview(params)
    const dealId = res.deal
    const fileId = res.file
    const reviewState = res.state
    const reviewComment = res.comment
    const docId = res.envelope_document

    let { deals, isUpdated } = AppStore.data.conciergeDeals
    const { deal, dealIndex } = getDeal(deals, dealId)
    const reviews = deal.reviews
    let newReviews = []

    const reviewType = fileId ? 'FILE' : 'DOC'
    switch (reviewType) {
      case 'FILE':
        const files = deal.files.map((file) => {
          if (file.id !== fileId)
            return file

          if (file.review) {
            file.review.state = reviewState
            file.review.comment = reviewComment
            newReviews = reviews.map((review) => {
              if (review.file !== fileId)
                return review

              review.state = reviewState
              review.comment = reviewComment
              return review
            })
            return file
          }
        })
        deals[dealIndex].files = files
        deals[dealIndex].reviews = newReviews
        break
      case 'DOC':
        const envelopes = deal.envelopes.map((envelope) => {
          if (!envelope.documents)
            return envelope

          const documents = envelope.documents.map((document) => {
            if (document.id !== docId)
              return document

            document.review.state = reviewState
            document.review.comment = reviewComment
            newReviews = reviews.map((review) => {
              if (review.envelope_document !== docId)
                return review

              review.state = reviewState
              review.comment = reviewComment
              return review
            })
            return document
          })
          envelope.documents = documents
          return envelope
        })
        deals[dealIndex].envelopes = envelopes
        deals[dealIndex].reviews = newReviews
        break
      default:
        return
    }
    AppStore.data.conciergeDeals.deals = deals
    if (!isUpdated)
      AppStore.data.conciergeDeals.isUpdated = true
    // AppStore.emitChange()
  } catch (error) {
    throw error
  }
}